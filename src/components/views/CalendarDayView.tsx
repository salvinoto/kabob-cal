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

    const calculateTimeFromYPosition = (y: number, containerRect: DOMRect, scrollTop: number = 0) => {
        const hourHeight = 80; // height of each hour block in pixels
        const relativeY = y - containerRect.top + scrollTop;
        const totalHours = relativeY / hourHeight;
        const hours = Math.floor(totalHours);
        const minutes = Math.floor((totalHours - hours) * 60);
        return { hours, minutes };
    };

    const handleDragStart = (event: DragStartEvent) => {
        console.log('Drag start:', event);
    };

    const handleDragOver = (event: DragOverEvent) => {
        console.log('Drag over:', event);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        
        if (!active.data.current) return;
        
        const draggedEvent = active.data.current.event as CalendarEvent;
        const duration = draggedEvent.end.getTime() - draggedEvent.start.getTime();

        // Get the container and scroll position
        const container = document.querySelector('.overflow-auto');
        if (!container) return;
        
        const containerRect = container.getBoundingClientRect();
        const scrollTop = container.scrollTop;

        // Calculate new time based on pointer position
        const pointerPosition = event.activatorEvent as PointerEvent;
        const { hours, minutes } = calculateTimeFromYPosition(
            pointerPosition.clientY,
            containerRect,
            scrollTop
        );

        // Ensure hours are within 0-23 range and minutes within 0-59
        const clampedHours = Math.max(0, Math.min(23, hours));
        const clampedMinutes = Math.max(0, Math.min(59, minutes));

        // Create new start date
        const newStart = setMinutes(setHours(date, clampedHours), clampedMinutes);
        const newEnd = new Date(newStart.getTime() + duration);

        // Update the event
        const updatedEvent = {
            ...draggedEvent,
            start: newStart,
            end: newEnd,
        };

        console.log('Updating event:', {
            originalStart: draggedEvent.start,
            newStart,
            originalEnd: draggedEvent.end,
            newEnd,
        });

        setEvents(events.map(e => e.id === draggedEvent.id ? updatedEvent : e));
        onUpdateEvent?.(updatedEvent);
    };

    if (view !== 'day') return null;

    const hours = [...Array(24)].map((_, i) => setHours(date, i));
    const dayStart = startOfDay(date);

    return (
        <DndContext
            collisionDetection={pointerWithin}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex relative pt-2 overflow-auto h-full">
                <TimeTable />
                <div className="flex-1">
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
                </div>
            </div>
        </DndContext>
    );
};
