import React from 'react';
import { CalendarProvider } from '../context/CalendarContext';
import { CalendarProps } from '../types';

export function Calendar({
    children,
    defaultDate = new Date(),
    locale,
    enableHotkeys = true,
    view: defaultView = 'month',
    onEventClick,
    events: defaultEvents = [],
    onChangeView,
    people,
    defaultSelectedPersonIds = [],
    onAddAppointment,
}: CalendarProps) {
    return (
        <CalendarProvider
            defaultDate={defaultDate}
            locale={locale}
            enableHotkeys={enableHotkeys}
            view={defaultView}
            onEventClick={onEventClick}
            events={defaultEvents}
            onChangeView={onChangeView}
            people={people}
            defaultSelectedPersonIds={defaultSelectedPersonIds}
            onAddAppointment={onAddAppointment}
        >
            <div className="flex flex-col gap-4">{children}</div>
        </CalendarProvider>
    );
}
