import { createContext, ReactNode, useState, useContext } from 'react';
import { Locale } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { ContextType, View, CalendarEvent, Person } from '../types';

const CalendarContext = createContext<ContextType>({
    view: 'month',
    setView: () => {},
    date: new Date(),
    setDate: () => {},
    events: [],
    setEvents: () => {},
    locale: enUS,
    today: new Date(),
    people: [],
    selectedPersonIds: [],
    setSelectedPersonIds: () => {},
    onChangeView: () => {},
    onEventClick: () => {},
    enableHotkeys: true,
    onAddAppointment: () => {},
});

function useCalendar() {
    const context = useContext(CalendarContext);
    if (!context) {
        throw new Error('useCalendar must be used within a CalendarProvider');
    }
    return context;
}

type CalendarProviderProps = {
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

function CalendarProvider({
    children,
    defaultDate = new Date(),
    locale = enUS,
    enableHotkeys = true,
    view: defaultView = 'month',
    onEventClick,
    events: defaultEvents = [],
    onChangeView,
    people,
    defaultSelectedPersonIds = [],
    onAddAppointment,
}: CalendarProviderProps) {
    const [view, setView] = useState<View>(defaultView);
    const [date, setDate] = useState(defaultDate);
    const [events, setEvents] = useState<CalendarEvent[]>(defaultEvents);
    const [selectedPersonIds, setSelectedPersonIds] = useState<string[]>(defaultSelectedPersonIds);

    const value = {
        view,
        setView,
        date,
        setDate,
        events,
        setEvents,
        locale,
        onChangeView,
        onEventClick,
        enableHotkeys,
        today: new Date(),
        people,
        selectedPersonIds,
        setSelectedPersonIds,
        onAddAppointment,
    };

    return (
        <CalendarContext.Provider value={value}>
            {children}
        </CalendarContext.Provider>
    );
}

export { CalendarContext, CalendarProvider, useCalendar };
