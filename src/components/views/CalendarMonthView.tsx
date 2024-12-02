import { format, isSameDay, isSameMonth, isToday, setHours } from 'date-fns';
import { cn } from '../../lib/utils';
import { useCalendar } from '../../context/CalendarContext';
import { useMemo } from 'react';
import { getDaysInMonth, generateWeekdays } from '../../lib/utils';
import { DraggableEvent } from '../DraggableEvent';
import { DndContext, DragEndEvent, DragOverlay, closestCenter } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { CalendarEvent } from '../../types';

export function CalendarMonthView() {
    const { 
        date, 
        view, 
        events, 
        locale, 
        people, 
        selectedPersonIds, 
        onAddAppointment,
        onUpdateEvent 
    } = useCalendar();

    const monthDates = useMemo(() => getDaysInMonth(date), [date]);
    const weekDays = useMemo(() => generateWeekdays(locale), [locale]);

    const handleDateClick = (date: Date) => {
        // Set to noon by default for month view clicks
        const appointmentDate = setHours(date, 12);
        onAddAppointment?.(appointmentDate);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        
        if (!over || !active.data.current) return;
        
        const draggedEvent = active.data.current.event as CalendarEvent;
        const dropDate = new Date(over.id);
        
        if (isSameDay(draggedEvent.start, dropDate)) return;
        
        // Calculate time difference between start and end
        const duration = draggedEvent.end.getTime() - draggedEvent.start.getTime();
        
        // Create new start date keeping the same time
        const newStart = new Date(dropDate);
        newStart.setHours(
            draggedEvent.start.getHours(),
            draggedEvent.start.getMinutes()
        );
        
        // Create new end date
        const newEnd = new Date(newStart.getTime() + duration);
        
        const updatedEvent = {
            ...draggedEvent,
            start: newStart,
            end: newEnd,
        };
        
        onUpdateEvent?.(updatedEvent);
    };

    if (view !== 'month') return null;

    return (
        <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <div className="h-full flex flex-col">
                <div className="grid grid-cols-7 gap-px sticky top-0 rounded-lg mb-2">
                    {weekDays.map((day, i) => (
                        <div
                            key={day}
                            className={cn(
                                'mb-2 text-center text-sm text-muted-foreground',
                                [0, 6].includes(i) && 'text-muted-foreground/50'
                            )}
                        >
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid overflow-hidden -mt-px flex-1 auto-rows-fr p-px grid-cols-7 gap-4">
                    <SortableContext items={events.map(e => e.id)} strategy={rectSortingStrategy}>
                        {monthDates.map((_date) => (
                            <div
                                className={cn(
                                    'ring-1 p-2 text-sm text-muted-foreground ring-border bg-border overflow-auto rounded-lg hover:bg-background transition-colors',
                                    !isSameMonth(date, _date) && 'text-muted-foreground/50 bg-border/50'
                                )}
                                key={_date.toString()}
                                onClick={() => handleDateClick(_date)}
                                role="button"
                                tabIndex={0}
                                id={_date.toISOString()}
                            >
                                <span
                                    className={cn(
                                        'size-6 grid place-items-center rounded-full mb-1 sticky top-0',
                                        isToday(_date) && 'bg-primary text-primary-foreground'
                                    )}
                                >
                                    {format(_date, 'd')}
                                </span>

                                {events
                                    .filter(
                                        (event) =>
                                            isSameDay(event.start, _date) &&
                                            selectedPersonIds.includes(event.personId)
                                    )
                                    .map((event) => {
                                        const person = people.find((p) => p.id === event.personId);
                                        return (
                                            <DraggableEvent
                                                key={event.id}
                                                event={event}
                                                person={person}
                                                view="month"
                                            />
                                        );
                                    })}
                            </div>
                        ))}
                    </SortableContext>
                </div>
            </div>
        </DndContext>
    );
}
