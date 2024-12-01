import { useCalendar } from '../../context/CalendarContext';
import { TimeTable } from '../TimeTable';
import { setHours, isSameHour, differenceInMinutes } from 'date-fns';
import { cn } from '../../lib/utils';
import { dayEventVariants } from '../ui/variants';
import { CalendarEvent, Person } from '@/types';

const EventGroup = ({
    events,
    hour,
    people,
}: {
    events: CalendarEvent[];
    hour: Date;
    people: Person[];
}) => {
    return (
        <div className="h-20 border-t last:border-b">
            {events
                .filter((event) => isSameHour(event.start, hour))
                .map((event) => {
                    const hoursDifference =
                        differenceInMinutes(event.end, event.start) / 60;
                    const startPosition = event.start.getMinutes() / 60;
                    const person = people.find((p) => p.id === event.personId);

                    return (
                        <div
                            key={event.id}
                            className={cn(
                                'relative',
                                dayEventVariants({ variant: person?.color || event.color })
                            )}
                            style={{
                                top: `${startPosition * 100}%`,
                                height: `${hoursDifference * 100}%`,
                            }}
                        >
                            <div className="text-xs font-semibold">{event.title}</div>
                            <div className="text-xs">{person?.name}</div>
                        </div>
                    );
                })}
        </div>
    );
};

export const CalendarDayView = () => {
    const { view, events, date, people, selectedPersonIds, onAddAppointment } = useCalendar();

    if (view !== 'day') return null;

    const hours = [...Array(24)].map((_, i) => setHours(date, i));

    const handleTimeClick = (hour: Date) => {
        onAddAppointment?.(hour);
    };

    return (
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
                    >
                        <EventGroup
                            hour={hour}
                            events={events.filter((event) => selectedPersonIds.includes(event.personId))}
                            people={people}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
