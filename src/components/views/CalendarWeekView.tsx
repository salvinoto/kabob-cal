import { useCalendar } from '../../context/CalendarContext';
import { format, startOfWeek, addDays, isToday, setHours, isSameDay, isSameHour, setMinutes, startOfDay } from 'date-fns';
import { cn } from '../../lib/utils';
import { TimeTable } from '../TimeTable';
import { useMemo } from 'react';
import { DraggableEvent } from '../DraggableEvent';
import { DndContext, DragEndEvent, closestCenter, DragStartEvent, DragOverEvent } from '@dnd-kit/core';
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

    const calculateTimeFromYPosition = (y: number, containerRect: DOMRect) => {
        const hourHeight = 80; // height of each hour block in pixels
        const scrollTop = containerRect.top;
        const relativeY = y - scrollTop;
        const totalMinutes = (relativeY / hourHeight) * 60;
        return Math.max(0, Math.min(totalMinutes, 24 * 60 - 1)); // Clamp between 0 and 23:59
    };

    const handleDragStart = (event: DragStartEvent) => {
        console.log('Week view - Drag start:', event);
    };

    const handleDragOver = (event: DragOverEvent) => {
        console.log('Week view - Drag over:', event);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        console.log('Week view - Drag end:', event);
        const { active, over } = event;
        
        if (!over || !active.data.current) return;
        
        const draggedEvent = active.data.current.event as CalendarEvent;
        const hourElement = document.getElementById(over.id as string);
        if (!hourElement) return;

        const containerRect = hourElement.getBoundingClientRect();
        const minutes = calculateTimeFromYPosition(event.over?.rect.top ?? 0, containerRect);
        
        // Calculate new times
        const duration = draggedEvent.end.getTime() - draggedEvent.start.getTime();
        const newStart = setMinutes(setHours(new Date(over.id), 0), minutes);
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
                                    'h-6 grid place-content-center',
                                    isToday(date) &&
                                    'bg-primary text-primary-foreground rounded-full size-6'
                                )}
                            >
                                {format(date, 'd')}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="flex flex-1">
                    <div className="w-fit">
                        <TimeTable />
                    </div>
                    <div className="grid grid-cols-7 flex-1">
                        <SortableContext items={events.map(e => e.id)} strategy={rectSortingStrategy}>
                            {weekDates.map((hours, i) => (
                                <div
                                    className={cn(
                                        'h-full text-sm text-muted-foreground border-l first:border-l-0',
                                        [0, 6].includes(i) && 'bg-muted/50'
                                    )}
                                    key={hours[0].toString()}
                                >
                                    {hours.map((hour) => {
                                        const dayStart = startOfDay(hour);
                                        const hourEvents = events.filter(
                                            (event) => 
                                                isSameDay(event.start, dayStart) && 
                                                isSameHour(event.start, hour) &&
                                                selectedPersonIds.includes(event.personId)
                                        );
                                        
                                        return (
                                            <div
                                                key={hour.toString()}
                                                onClick={() => handleTimeClick(hour)}
                                                className="relative h-20"
                                                role="button"
                                                tabIndex={0}
                                                id={hour.toISOString()}
                                                data-type="hour"
                                            >
                                                {hourEvents.map((event) => {
                                                    const person = people.find((p) => p.id === event.personId);
                                                    const startMinutes = event.start.getMinutes();
                                                    const duration = (event.end.getTime() - event.start.getTime()) / (60 * 60 * 1000);
                                                    
                                                    return (
                                                        <DraggableEvent
                                                            key={event.id}
                                                            event={event}
                                                            person={person}
                                                            view="week"
                                                            style={{
                                                                position: 'absolute',
                                                                top: `${(startMinutes / 60) * 100}%`,
                                                                left: 0,
                                                                right: 0,
                                                                height: `${duration * 100}%`,
                                                            }}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </SortableContext>
                    </div>
                </div>
            </div>
        </DndContext>
    );
};
