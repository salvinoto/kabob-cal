import { useCalendar } from '../../context/CalendarContext';
import { TimeTable } from '../TimeTable';
import { setHours, isSameHour, differenceInMinutes } from 'date-fns';
import { cn } from '../../lib/utils';
import { DraggableEvent } from '../DraggableEvent';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
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
        onUpdateEvent 
    } = useCalendar();

    const handleTimeClick = (hour: Date) => {
        onAddAppointment?.(hour);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        
        if (!over || !active.data.current) return;
        
        const draggedEvent = active.data.current.event as CalendarEvent;
        const dropDate = new Date(over.id);
        
        if (isSameHour(draggedEvent.start, dropDate)) return;
        
        // Calculate time difference between start and end
        const duration = draggedEvent.end.getTime() - draggedEvent.start.getTime();
        
        // Create new start date
        const newStart = new Date(dropDate);
        
        // Create new end date
        const newEnd = new Date(newStart.getTime() + duration);
        
        const updatedEvent = {
            ...draggedEvent,
            start: newStart,
            end: newEnd,
        };
        
        onUpdateEvent?.(updatedEvent);
    };

    if (view !== 'day') return null;

    const hours = [...Array(24)].map((_, i) => setHours(date, i));

    return (
        <DndContext
            collisionDetection={closestCenter}
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
                            >
                                <div className="h-20 border-t last:border-b">
                                    {events
                                        .filter(
                                            (event) =>
                                                isSameHour(event.start, hour) &&
                                                selectedPersonIds.includes(event.personId)
                                        )
                                        .map((event) => {
                                            const person = people.find((p) => p.id === event.personId);
                                            return (
                                                <DraggableEvent
                                                    key={event.id}
                                                    event={event}
                                                    person={person}
                                                    view="day"
                                                    style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        height: `${(event.end.getTime() - event.start.getTime()) / (60 * 60 * 1000) * 100}%`,
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
