import { VariantProps } from 'class-variance-authority';
import { Locale } from 'date-fns';
import { monthEventVariants } from '../components/ui/variants';
import { ReactNode } from 'react';

export type View = 'day' | 'week' | 'month' | 'year';

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

export type ContextType = {
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

export type CalendarProps = {
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
