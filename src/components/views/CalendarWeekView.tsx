import { useState } from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { format, startOfWeek, addDays, isToday, setHours, isSameDay, isSameHour, setMinutes, startOfDay, differenceInMinutes } from 'date-fns';
import { cn } from '../../lib/utils';
import { TimeTable } from '../TimeTable';
import { useMemo } from 'react';
import { DraggableEvent } from '../DraggableEvent';
import { 
    DndContext, 
    DragEndEvent, 
    closestCenter, 
    DragStartEvent, 
    DragOverEvent,
    pointerWithin,
    DragOverlay,
    useDroppable
} from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { CalendarEvent } from '../../types';

export const CalendarWeekView = () => {
    const { 
        view, 
        date, 
        locale, 
        events, 
        people, 
        selectedPersonIds, 
        onAddAppointment,
        onUpdateEvent,
        setEvents 
    } = useCalendar();

    const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null);

    const weekDates = useMemo(() => {
        const start = startOfWeek(date, { weekStartsOn: 0 });
        const weekDates = [];

        for (let i = 0; i < 7; i++) {
            const day = addDays(start, i);
            const hours = [...Array(24)].map((_, i) => setHours(day, i));
            weekDates.push(hours);
        }

        return weekDates;
    }, [date]);

    const headerDays = useMemo(() => {
        const daysOfWeek = [];
        for (let i = 0; i < 7; i++) {
            const result = addDays(startOfWeek(date, { weekStartsOn: 0 }), i);
            daysOfWeek.push(result);
        }
        return daysOfWeek;
    }, [date]);

    const handleTimeClick = (date: Date) => {
        onAddAppointment?.(date);
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const draggedEvent = active.data.current?.event as CalendarEvent;
        if (draggedEvent) {
            setActiveEvent(draggedEvent);
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        // Optional: Add any drag over effects if needed
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveEvent(null);
        
        if (!active.data.current?.event || !over?.data.current) return;
        
        const draggedEvent = active.data.current.event as CalendarEvent;
        const dropData = over.data.current as { hour: number; date: Date };
        
        if (typeof dropData.hour !== 'number' || !dropData.date) return;

        const duration = draggedEvent.end.getTime() - draggedEvent.start.getTime();
        const originalMinutes = draggedEvent.start.getMinutes();

        // Create new start date while preserving the minutes
        const newStart = setMinutes(
            setHours(startOfDay(dropData.date), dropData.hour),
            originalMinutes
        );
        const newEnd = new Date(newStart.getTime() + duration);

        // Check for collisions in the same day
        const collidingEvents = events.filter(e => 
            e.id !== draggedEvent.id &&
            isSameDay(e.start, newStart) &&
            e.start.getTime() < newEnd.getTime() &&
            e.end.getTime() > newStart.getTime()
        );

        if (collidingEvents.length > 0) {
            // Push colliding events down
            const updatedEvents = events.map(e => {
                if (collidingEvents.find(ce => ce.id === e.id)) {
                    const pushDuration = newEnd.getTime() - e.start.getTime();
                    return {
                        ...e,
                        start: new Date(e.start.getTime() + pushDuration),
                        end: new Date(e.end.getTime() + pushDuration)
                    };
                }
                return e;
            });

            // Update dragged event
            const finalEvents = updatedEvents.map(e => 
                e.id === draggedEvent.id
                    ? { ...draggedEvent, start: newStart, end: newEnd }
                    : e
            );

            setEvents(finalEvents);
            finalEvents.forEach(e => {
                if (e.id === draggedEvent.id || collidingEvents.find(ce => ce.id === e.id)) {
                    onUpdateEvent?.(e);
                }
            });
        } else {
            // No collisions, just update the dragged event
            const updatedEvent = {
                ...draggedEvent,
                start: newStart,
                end: newEnd,
            };
            
            setEvents(events.map(e => e.id === draggedEvent.id ? updatedEvent : e));
            onUpdateEvent?.(updatedEvent);
        }
    };

    if (view !== 'week') return null;

    return (
        <DndContext
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-col relative overflow-auto h-full">
                {/* Header */}
                <div className="flex sticky top-0 bg-card z-10 border-b mb-3">
                    <div className="w-12"></div>
                    {headerDays.map((date, i) => (
                        <div
                            key={date.toString()}
                            className={cn(
                                'text-center flex-1 gap-1 pb-2 text-sm text-muted-foreground flex items-center justify-center',
                                [0, 6].includes(i) && 'text-muted-foreground/50'
                            )}
                        >
                            {format(date, 'E', { locale })}
                            <span
                                className={cn(
                                    'h-6 grid place-content-center ml-1',
                                    isToday(date) &&
                                    'bg-primary text-primary-foreground rounded-full size-6'
                                )}
                            >
                                {format(date, 'd')}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Time grid */}
                <div className="flex flex-1">
                    <div className="w-12">
                        <TimeTable onTimeClick={handleTimeClick} />
                    </div>
                    <div className="grid flex-1 grid-cols-7">
                        {weekDates.map((hours, dayIndex) => (
                            <div
                                key={hours[0].toString()}
                                className={cn(
                                    'relative border-l first:border-l-0',
                                    [0, 6].includes(dayIndex) && 'bg-muted/5'
                                )}
                            >
                                {hours.map((hour) => {
                                    const hourEvents = events.filter(event => 
                                        isSameDay(event.start, hour) && 
                                        isSameHour(event.start, hour) &&
                                        selectedPersonIds.includes(event.personId)
                                    );

                                    return (
                                        <DroppableHourSlot 
                                            key={hour.toString()} 
                                            hour={hour}
                                            isToday={isToday(hour)}
                                            onTimeClick={handleTimeClick}
                                        >
                                            {hourEvents.map(event => {
                                                const person = people.find(p => p.id === event.personId);
                                                const startMinutes = event.start.getMinutes();
                                                const duration = differenceInMinutes(event.end, event.start) / 60;
                                                
                                                return (
                                                    <DraggableEvent
                                                        key={event.id}
                                                        event={event}
                                                        person={person}
                                                        view="week"
                                                        style={{
                                                            position: 'absolute',
                                                            top: `${(startMinutes / 60) * 80}px`,
                                                            left: '4px',
                                                            right: '4px',
                                                            height: `${duration * 80}px`,
                                                            pointerEvents: 'auto',
                                                        }}
                                                    />
                                                );
                                            })}
                                        </DroppableHourSlot>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <DragOverlay>
                {activeEvent ? (
                    <DraggableEvent
                        event={activeEvent}
                        person={people?.find((p) => p.id === activeEvent.personId)}
                        view="week"
                        style={{
                            width: '100%',
                            height: `${(differenceInMinutes(activeEvent.end, activeEvent.start) / 60) * 80}px`,
                            pointerEvents: 'none',
                            opacity: 0.8,
                        }}
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

interface DroppableHourSlotProps {
    hour: Date;
    isToday: boolean;
    onTimeClick: (hour: Date) => void;
    children?: React.ReactNode;
}

const DroppableHourSlot = ({ hour, isToday, onTimeClick, children }: DroppableHourSlotProps) => {
    const { setNodeRef, isOver } = useDroppable({
        id: hour.toString(),
        data: { hour: hour.getHours(), date: hour }
    });

    return (
        <div
            ref={setNodeRef}
            id={hour.toString()}
            className={cn(
                'h-20 border-t border-border relative group transition-colors',
                isToday && 'bg-muted/5',
                isOver && 'bg-muted/20'
            )}
            onClick={() => onTimeClick(hour)}
            data-hour={hour.getHours()}
            style={{
                zIndex: isOver ? 10 : 'auto'
            }}
        >
            {children}
        </div>
    );
};
