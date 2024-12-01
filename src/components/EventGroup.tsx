import { useContext } from 'react';
import { CalendarContext } from '../context/CalendarContext';
import { CalendarEvent, Person } from '../types';
import { cn } from '../lib/utils';
import { dayEventVariants } from './ui/variants';
import { format } from 'date-fns';

interface EventGroupProps {
    events: CalendarEvent[];
    hour: Date;
    people: Person[];
}

export function EventGroup({ events, hour, people }: EventGroupProps) {
    const { onEventClick } = useContext(CalendarContext);

    return (
        <div className="space-y-1">
            {events.map((event) => {
                const person = people.find((p) => p.id === event.personId);
                return (
                    <button
                        key={event.id}
                        onClick={() => onEventClick?.(event)}
                        className={cn(
                            dayEventVariants({
                                variant: event.color ?? person?.color ?? 'default',
                            }),
                            'w-full text-left'
                        )}
                    >
                        <div className="font-medium">{event.title}</div>
                        <div className="text-xs opacity-70">
                            {format(event.start, 'HH:mm')} -{' '}
                            {format(event.end, 'HH:mm')}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
