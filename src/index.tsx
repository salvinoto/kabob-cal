'use client';

import React from 'react'; // Added React import
import './globals.css';

import { Button } from './components/ui/button';
import { cn } from './lib/utils';
import { VariantProps, cva } from 'class-variance-authority';
import {
    Locale,
    addDays,
    addMonths,
    addWeeks,
    addYears,
    differenceInMinutes,
    format,
    getMonth,
    isSameDay,
    isSameHour,
    isSameMonth,
    isToday,
    setHours,
    setMonth,
    startOfMonth,
    startOfWeek,
    subDays,
    subMonths,
    subWeeks,
    subYears,
} from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import {
    ReactNode,
    createContext,
    forwardRef,
    useCallback,
    useContext,
    useMemo,
    useState,
    useEffect,
} from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from "./components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react"; // Assuming you're using lucide-react for icons

const monthEventVariants = cva('size-2 rounded-full', {
    variants: {
        variant: {
            default: 'bg-primary',
            blue: 'bg-blue-500',
            green: 'bg-green-500',
            pink: 'bg-pink-500',
            purple: 'bg-purple-500',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});

const dayEventVariants = cva('font-bold border-l-4 rounded p-2 text-xs', {
    variants: {
        variant: {
            default: 'bg-muted/30 text-muted-foreground border-muted',
            blue: 'bg-blue-500/30 text-blue-600 border-blue-500',
            green: 'bg-green-500/30 text-green-600 border-green-500',
            pink: 'bg-pink-500/30 text-pink-600 border-pink-500',
            purple: 'bg-purple-500/30 text-purple-600 border-purple-500',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});

type View = 'day' | 'week' | 'month' | 'year';

export type Person = {
    id: string;
    name: string;
    color?: VariantProps<typeof monthEventVariants>['variant'];
};

export type CalendarEvent = {
    id: string;
    start: Date;
    end: Date;
    title: string;
    personId: string;
    color?: VariantProps<typeof monthEventVariants>['variant'];
};

type ContextType = {
    view: View;
    setView: (view: View) => void;
    date: Date;
    setDate: (date: Date) => void;
    events: CalendarEvent[];
    locale: Locale;
    setEvents: (date: CalendarEvent[]) => void;
    onChangeView?: (view: View) => void;
    onEventClick?: (event: CalendarEvent) => void;
    enableHotkeys?: boolean;
    today: Date;
    people: Person[];
    selectedPersonIds: string[];
    setSelectedPersonIds: (ids: string[]) => void;
    onAddAppointment?: (date: Date) => void;
};

const Context = createContext<ContextType>({} as ContextType);

type CalendarProps = {
    children: ReactNode;
    defaultDate?: Date;
    events?: CalendarEvent[];
    view?: View;
    locale?: Locale;
    enableHotkeys?: boolean;
    onChangeView?: (view: View) => void;
    onEventClick?: (event: CalendarEvent) => void;
    people: Person[];
    defaultSelectedPersonIds?: string[];
    onAddAppointment?: (date: Date) => void;
};

const Calendar = ({
    children,
    defaultDate = new Date(),
    locale = enUS,
    enableHotkeys = true,
    view: _defaultMode = 'month',
    onEventClick,
    events: defaultEvents = [],
    onChangeView,
    people,
    defaultSelectedPersonIds = [],
    onAddAppointment,
}: CalendarProps) => {
    const [view, setView] = useState<View>('month');
    const [date, setDate] = useState(defaultDate);
    const [events, setEvents] = useState<CalendarEvent[]>(defaultEvents);
    const [selectedPersonIds, setSelectedPersonIds] = useState<string[]>(defaultSelectedPersonIds);

    useEffect(() => {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) {
            setView('day');
        }
    }, []);

    const changeView = (view: View) => {
        setView(view);
        onChangeView?.(view);
    };

    useHotkeys('m', () => changeView('month'), {
        enabled: enableHotkeys,
    });

    useHotkeys('w', () => changeView('week'), {
        enabled: enableHotkeys,
    });

    useHotkeys('y', () => changeView('year'), {
        enabled: enableHotkeys,
    });

    useHotkeys('d', () => changeView('day'), {
        enabled: enableHotkeys,
    });

    return (
        <Context.Provider
            value={{
                view,
                setView,
                date,
                setDate,
                events,
                setEvents,
                locale,
                enableHotkeys,
                onEventClick,
                onChangeView,
                today: new Date(),
                people,
                selectedPersonIds,
                setSelectedPersonIds,
                onAddAppointment,
            }}
        >
            {children}
        </Context.Provider>
    );
};

export const useCalendar = () => useContext(Context);

type CalendarPersonSelectorProps = {
  className?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
};

const CalendarPersonSelector = ({
  className,
  buttonClassName,
  dropdownClassName,
}: CalendarPersonSelectorProps) => {
    const { people, selectedPersonIds, setSelectedPersonIds } = useCalendar();

    const togglePerson = (personId: string) => {
        if (selectedPersonIds.includes(personId)) {
            setSelectedPersonIds(selectedPersonIds.filter((id) => id !== personId));
        } else {
            setSelectedPersonIds([...selectedPersonIds, personId]);
        }
    };

    return (
        <div className={cn("relative", className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button 
                        variant="outline" 
                        className={cn("flex items-center gap-2", buttonClassName)}
                    >
                        Select People 
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                    className={cn("w-56", dropdownClassName)}
                >
                    {people.map((person) => (
                        <DropdownMenuCheckboxItem
                            key={person.id}
                            checked={selectedPersonIds.includes(person.id)}
                            onCheckedChange={() => togglePerson(person.id)}
                        >
                            {person.name}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

const CalendarViewTrigger = forwardRef<
    HTMLButtonElement,
    React.HTMLAttributes<HTMLButtonElement> & {
        view: View;
    }
>(({ children, view, ...props }, ref) => {
    const { view: currentView, setView, onChangeView } = useCalendar();

    return (
        <Button
            aria-current={currentView === view}
            size="sm"
            variant="ghost"
            ref={ref}
            {...props}
            onClick={() => {
                setView(view);
                onChangeView?.(view);
            }}
        >
            {children}
        </Button>
    );
});
CalendarViewTrigger.displayName = 'CalendarViewTrigger';

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

const CalendarDayView = () => {
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

const CalendarWeekView = () => {
    const { view, date, locale, events, people, selectedPersonIds, onAddAppointment } = useCalendar();

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

    if (view !== 'week') return null;

    return (
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
                    {weekDates.map((hours, i) => (
                        <div
                            className={cn(
                                'h-full text-sm text-muted-foreground border-l first:border-l-0',
                                [0, 6].includes(i) && 'bg-muted/50'
                            )}
                            key={hours[0].toString()}
                        >
                            {hours.map((hour) => (
                                <div
                                    key={hour.toString()}
                                    onClick={() => handleTimeClick(hour)}
                                    className="relative cursor-pointer"
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
                    ))}
                </div>
            </div>
        </div>
    );
};

const CalendarMonthView = () => {
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
};

const CalendarYearView = () => {
    const { view, date, today, locale, onAddAppointment } = useCalendar();

    const months = useMemo(() => {
        if (!view) {
            return [];
        }

        return Array.from({ length: 12 }).map((_, i) => {
            return getDaysInMonth(setMonth(date, i));
        });
    }, [date, view]);

    const weekDays = useMemo(() => generateWeekdays(locale), [locale]);

    const handleDateClick = (date: Date) => {
        // Set to noon by default for year view clicks
        const appointmentDate = setHours(date, 12);
        onAddAppointment?.(appointmentDate);
    };

    if (view !== 'year') return null;

    return (
        <div className="grid grid-cols-4 gap-10 overflow-auto h-full">
            {months.map((days, i) => (
                <div key={days[0].toString()}>
                    <span className="text-xl">{i + 1}</span>

                    <div className="grid grid-cols-7 gap-2 my-5">
                        {weekDays.map((day) => (
                            <div
                                key={day}
                                className="text-center text-xs text-muted-foreground"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid gap-x-2 text-center grid-cols-7 text-xs tabular-nums">
                        {days.map((_date) => (
                            <div
                                key={_date.toString()}
                                className={cn(
                                    'cursor-pointer hover:bg-muted/50 rounded transition-colors',
                                    getMonth(_date) !== i && 'text-muted-foreground'
                                )}
                                onClick={() => handleDateClick(_date)}
                                role="button"
                                tabIndex={0}
                            >
                                <div
                                    className={cn(
                                        'aspect-square grid place-content-center size-full tabular-nums',
                                        isSameDay(today, _date) &&
                                        getMonth(_date) === i &&
                                        'bg-primary text-primary-foreground rounded-full'
                                    )}
                                >
                                    {format(_date, 'd')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

const CalendarNextTrigger = forwardRef<
    HTMLButtonElement,
    React.HTMLAttributes<HTMLButtonElement>
>(({ children, onClick, ...props }, ref) => {
    const { date, setDate, view, enableHotkeys } = useCalendar();

    const next = useCallback(() => {
        if (view === 'day') {
            setDate(addDays(date, 1));
        } else if (view === 'week') {
            setDate(addWeeks(date, 1));
        } else if (view === 'month') {
            setDate(addMonths(date, 1));
        } else if (view === 'year') {
            setDate(addYears(date, 1));
        }
    }, [date, view, setDate]);

    useHotkeys('ArrowRight', () => next(), {
        enabled: enableHotkeys,
    });

    return (
        <Button
            size="icon"
            variant="outline"
            ref={ref}
            {...props}
            onClick={(e) => {
                next();
                onClick?.(e);
            }}
        >
            {children}
        </Button>
    );
});
CalendarNextTrigger.displayName = 'CalendarNextTrigger';

const CalendarPrevTrigger = forwardRef<
    HTMLButtonElement,
    React.HTMLAttributes<HTMLButtonElement>
>(({ children, onClick, ...props }, ref) => {
    const { date, setDate, view, enableHotkeys } = useCalendar();

    useHotkeys('ArrowLeft', () => prev(), {
        enabled: enableHotkeys,
    });

    const prev = useCallback(() => {
        if (view === 'day') {
            setDate(subDays(date, 1));
        } else if (view === 'week') {
            setDate(subWeeks(date, 1));
        } else if (view === 'month') {
            setDate(subMonths(date, 1));
        } else if (view === 'year') {
            setDate(subYears(date, 1));
        }
    }, [date, view, setDate]);

    return (
        <Button
            size="icon"
            variant="outline"
            ref={ref}
            {...props}
            onClick={(e) => {
                prev();
                onClick?.(e);
            }}
        >
            {children}
        </Button>
    );
});
CalendarPrevTrigger.displayName = 'CalendarPrevTrigger';

const CalendarTodayTrigger = forwardRef<
    HTMLButtonElement,
    React.HTMLAttributes<HTMLButtonElement>
>(({ children, onClick, ...props }, ref) => {
    const { setDate, enableHotkeys, today } = useCalendar();

    useHotkeys('t', () => jumpToToday(), {
        enabled: enableHotkeys,
    });

    const jumpToToday = useCallback(() => {
        setDate(today);
    }, [today, setDate]);

    return (
        <Button
            variant="outline"
            ref={ref}
            {...props}
            onClick={(e) => {
                jumpToToday();
                onClick?.(e);
            }}
        >
            {children}
        </Button>
    );
});
CalendarTodayTrigger.displayName = 'CalendarTodayTrigger';

type CalendarCurrentDateProps = {
    className?: string;
};

const CalendarCurrentDate = ({ className }: CalendarCurrentDateProps) => {
    const { date, view } = useCalendar();

    return (
        <time 
            dateTime={date.toISOString()} 
            className={cn("tabular-nums text-2xl font-bold", className)}
        >
            {format(date, view === 'day' ? 'dd MMMM yyyy' : 'MMMM yyyy')}
        </time>
    );
};

const TimeTable = () => {
    const now = new Date();

    return (
        <div className="pr-2 w-12">
            {Array.from(Array(25).keys()).map((hour) => {
                return (
                    <div
                        className="text-right relative text-xs text-muted-foreground/50 h-20 last:h-0"
                        key={hour}
                    >
                        {now.getHours() === hour && (
                            <div
                                className="absolute z- left-full translate-x-2 w-dvw h-[2px] bg-red-500"
                                style={{
                                    top: `${(now.getMinutes() / 60) * 100}%`,
                                }}
                            >
                                <div className="size-2 rounded-full bg-red-500 absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                            </div>
                        )}
                        <p className="top-0 -translate-y-1/2">
                            {hour === 24 ? 0 : hour}:00
                        </p>
                    </div>
                );
            })}
        </div>
    );
};

const getDaysInMonth = (date: Date) => {
    const startOfMonthDate = startOfMonth(date);
    const startOfWeekForMonth = startOfWeek(startOfMonthDate, {
        weekStartsOn: 0,
    });

    let currentDate = startOfWeekForMonth;
    const calendar = [];

    while (calendar.length < 42) {
        calendar.push(new Date(currentDate));
        currentDate = addDays(currentDate, 1);
    }

    return calendar;
};

const generateWeekdays = (locale: Locale) => {
    const daysOfWeek = [];
    for (let i = 0; i < 7; i++) {
        const date = addDays(startOfWeek(new Date(), { weekStartsOn: 0 }), i);
        daysOfWeek.push(format(date, 'EEEEEE', { locale }));
    }
    return daysOfWeek;
};

export {
    Calendar,
    CalendarCurrentDate,
    CalendarDayView,
    CalendarMonthView,
    CalendarNextTrigger,
    CalendarPrevTrigger,
    CalendarTodayTrigger,
    CalendarViewTrigger,
    CalendarWeekView,
    CalendarYearView,
    CalendarPersonSelector,
};
