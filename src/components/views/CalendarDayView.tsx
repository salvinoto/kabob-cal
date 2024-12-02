import { useCalendar } from '../../context/CalendarContext';
import { TimeTable } from '../TimeTable';
import { setHours, isSameHour, differenceInMinutes, setMinutes, startOfDay, isSameDay } from 'date-fns';
import { cn } from '../../lib/utils';
import { DraggableEvent } from '../DraggableEvent';
import { DndContext, DragEndEvent, closestCenter, DragStartEvent, DragOverEvent } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { CalendarEvent } from '../../types';

export const CalendarDayView = () => {
    const { 
        view, 
        events, 
        date, 
        people, 
        selectedPersonIds, 
        onAddAppointment,
        onUpdateEvent,
        setEvents 
    } = useCalendar();

    const handleTimeClick = (hour: Date) => {
        onAddAppointment?.(hour);
    };

    const calculateTimeFromYPosition = (y: number, containerRect: DOMRect) => {
        const hourHeight = 80; // height of each hour block in pixels
        const scrollTop = containerRect.top;
        const relativeY = y - scrollTop;
        const totalMinutes = (relativeY / hourHeight) * 60;
        return Math.max(0, Math.min(totalMinutes, 24 * 60 - 1)); // Clamp between 0 and 23:59
    };

    const handleDragStart = (event: DragStartEvent) => {
        console.log('Drag start:', event);
    };

    const handleDragOver = (event: DragOverEvent) => {
        console.log('Drag over:', event);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        console.log('Drag end:', event);
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
        
        // Check for collisions
        const collidingEvents = events.filter(e => 
            e.id !== draggedEvent.id &&
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

    if (view !== 'day') return null;

    const hours = [...Array(24)].map((_, i) => setHours(date, i));
    const dayStart = startOfDay(date);

    return (
        <DndContext
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex relative pt-2 overflow-auto h-full">
                <TimeTable />
                <div className="flex-1">
                    <SortableContext items={events.map(e => e.id)} strategy={rectSortingStrategy}>
                        {hours.map((hour) => (
                            <div
                                key={hour.toString()}
                                className="relative"
                                onClick={() => handleTimeClick(hour)}
                                role="button"
                                tabIndex={0}
                                id={hour.toISOString()}
                                data-type="hour"
                            >
                                <div className="h-20 border-t last:border-b">
                                    {events
                                        .filter(
                                            (event) =>
                                                isSameDay(event.start, dayStart) &&
                                                isSameHour(event.start, hour) &&
                                                selectedPersonIds.includes(event.personId)
                                        )
                                        .map((event) => {
                                            const person = people.find((p) => p.id === event.personId);
                                            const startMinutes = event.start.getMinutes();
                                            const duration = (event.end.getTime() - event.start.getTime()) / (60 * 60 * 1000);
                                            
                                            return (
                                                <DraggableEvent
                                                    key={event.id}
                                                    event={event}
                                                    person={person}
                                                    view="day"
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
                            </div>
                        ))}
                    </SortableContext>
                </div>
            </div>
        </DndContext>
    );
};
