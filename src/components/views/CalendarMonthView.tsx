import { format, isSameDay, isSameMonth, isToday, setHours } from 'date-fns';
import { cn } from '../../lib/utils';
import { monthEventVariants } from '../ui/variants';
import { useCalendar } from '../../context/CalendarContext';
import { useMemo } from 'react';
import { getDaysInMonth, generateWeekdays } from '../../lib/utils';

export function CalendarMonthView() {
    const { date, view, events, locale, people, selectedPersonIds, onAddAppointment } = useCalendar();

    const monthDates = useMemo(() => getDaysInMonth(date), [date]);
    const weekDays = useMemo(() => generateWeekdays(locale), [locale]);

    const handleDateClick = (date: Date) => {
        // Set to noon by default for month view clicks
        const appointmentDate = setHours(date, 12);
        onAddAppointment?.(appointmentDate);
    };

    if (view !== 'month') return null;

    return (
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
                {monthDates.map((_date) => (
                    <div
                        className={cn(
                            'ring-1 p-2 text-sm text-muted-foreground ring-border bg-border overflow-auto rounded-lg hover:bg-background transition-colors cursor-pointer',
                            !isSameMonth(date, _date) && 'text-muted-foreground/50 bg-border/50'
                        )}
                        key={_date.toString()}
                        onClick={() => handleDateClick(_date)}
                        role="button"
                        tabIndex={0}
                    >
                        <span
                            className={cn(
                                'size-6 grid place-items-center rounded-full mb-1 sticky top-0',
                                isToday(_date) && 'bg-primary text-primary-foreground'
                            )}
                        >
                            {format(_date, 'd')}
                        </span>

                        {events.filter(
                            (event) =>
                                isSameDay(event.start, _date) &&
                                selectedPersonIds.includes(event.personId)
                        ).map((event) => {
                            const person = people.find((p) => p.id === event.personId);
                            return (
                                <div
                                    key={event.id}
                                    className="px-1 rounded text-sm flex items-center gap-1"
                                >
                                    <div
                                        className={cn(
                                            'shrink-0',
                                            monthEventVariants({ variant: person?.color || event.color })
                                        )}
                                    ></div>
                                    <span className="flex-1 truncate">{event.title}</span>
                                    <span className="text-xs text-muted-foreground">{person?.name}</span>
                                    <time className="tabular-nums text-muted-foreground/50 text-xs">
                                        {format(event.start, 'HH:mm')}
                                    </time>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}
