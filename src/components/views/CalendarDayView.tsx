import { useCalendar } from '../../context/CalendarContext';
import { TimeTable } from '../TimeTable';
import { setHours, isSameHour, differenceInMinutes, setMinutes, startOfDay, isSameDay } from 'date-fns';
import { cn } from '../../lib/utils';
import { DraggableEvent } from '../DraggableEvent';
import { 
    DndContext, 
    DragEndEvent, 
    DragStartEvent, 
    DragOverEvent, 
    pointerWithin,
    DragOverlay
} from '@dnd-kit/core';
import { CalendarEvent } from '../../types';
import { useState } from 'react';

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

    const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null);

    const handleTimeClick = (hour: Date) => {
        onAddAppointment?.(hour);
    };

    const calculateTimeFromYPosition = (y: number, containerRect: DOMRect, scrollTop: number = 0) => {
        const hourHeight = 80; // height of each hour block in pixels
        const relativeY = y - containerRect.top + scrollTop;
        const totalMinutes = Math.floor((relativeY / hourHeight) * 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return { hours, minutes };
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
        const dropData = over.data.current as { hour: number };
        
        if (typeof dropData.hour !== 'number') return;

        const duration = draggedEvent.end.getTime() - draggedEvent.start.getTime();
        const originalMinutes = draggedEvent.start.getMinutes();

        // Create new start date while preserving the original date and minutes
        const newStart = setMinutes(
            setHours(startOfDay(draggedEvent.start), dropData.hour),
            originalMinutes
        );
        const newEnd = new Date(newStart.getTime() + duration);

        // Update the event
        const updatedEvent = {
            ...draggedEvent,
            start: newStart,
            end: newEnd,
        };

        setEvents(events.map(e => e.id === draggedEvent.id ? updatedEvent : e));
        onUpdateEvent?.(updatedEvent);
    };

    if (view !== 'day') return null;

    const hours = [...Array(24)].map((_, i) => setHours(date, i));
    const dayStart = startOfDay(date);

    return (
        <DndContext
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
        >
            <div className="flex flex-1 overflow-hidden relative">
                <TimeTable onTimeClick={handleTimeClick} />
                <div className="absolute inset-0 left-12 pointer-events-none">
                    {events
                        .filter((event) => isSameDay(event.start, date))
                        .map((event) => {
                            const person = people?.find((p) => p.id === event.personId);
                            const startHour = event.start.getHours();
                            const duration = differenceInMinutes(event.end, event.start);
                            // Position events at the start of the hour slot
                            const top = (startHour * 80) + ((event.start.getMinutes() / 60) * 80);
                            const height = (duration / 60) * 80;

                            return (
                                <DraggableEvent
                                    key={event.id}
                                    event={event}
                                    person={person}
                                    view="day"
                                    style={{
                                        position: 'absolute',
                                        top: `${top}px`,
                                        height: `${height}px`,
                                        width: 'calc(100% - 16px)',
                                        left: 8,
                                        pointerEvents: 'auto',
                                    }}
                                />
                            );
                        })}
                </div>
            </div>
            <DragOverlay>
                {activeEvent ? (
                    <DraggableEvent
                        event={activeEvent}
                        person={people?.find((p) => p.id === activeEvent.personId)}
                        view="day"
                        style={{
                            width: 'calc(100% - 16px)',
                            height: `${(differenceInMinutes(activeEvent.end, activeEvent.start) / 60) * 80}px`,
                        }}
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};
