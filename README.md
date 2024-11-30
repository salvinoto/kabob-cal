# Kabob Calendar

A modern, flexible, and customizable calendar component library for React applications. Built with TypeScript and featuring multiple view modes, person management, and event handling capabilities.

## Features

- 📅 Multiple calendar views:
  - Month view
  - Week view
  - Day view
  - Year view
- 👥 Person management and filtering
- 🎨 Customizable event colors
- 🌐 Internationalization support
- ⌨️ Optional hotkey support
- 🎯 Event click handling
- 🔄 View switching capabilities
- 📱 Modern UI with Radix UI components

## Installation

```bash
npm install kabob-cal
# or
yarn add kabob-cal
# or
pnpm add kabob-cal
```

## Requirements

This package has the following peer dependencies:
- React ^18.2.0
- React DOM ^18.2.0

## Basic Usage

```tsx
import { Calendar, CalendarEvent, Person } from 'kabob-cal';

const MyCalendarComponent = () => {
  const events: CalendarEvent[] = [
    {
      id: '1',
      start: new Date(),
      end: new Date(),
      title: 'Sample Event',
      personId: 'person1',
    }
  ];

  const people: Person[] = [
    {
      id: 'person1',
      name: 'John Doe',
      color: 'blue'
    }
  ];

  return (
    <Calendar
      events={events}
      people={people}
      defaultView="month"
      onEventClick={(event) => console.log('Event clicked:', event)}
    >
      {/* Calendar components will be rendered here */}
    </Calendar>
  );
};
```

## Advanced Example

Here's a complete example showing a medical appointment calendar with multiple doctors and appointments:

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, CalendarCurrentDate, CalendarDayView, CalendarEvent, CalendarMonthView, CalendarNextTrigger, CalendarPersonSelector, CalendarPrevTrigger, CalendarTodayTrigger, CalendarViewTrigger, CalendarWeekView, CalendarYearView, Person } from 'kabob-cal';
import 'kabob-cal/dist/globals.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const App = () => {
  // Sample people data
  const people: Person[] = [
    {
      id: 'doctor1',
      name: 'Dr. Smith',
      color: '#4f46e5' // indigo color
    },
    {
      id: 'doctor2',
      name: 'Dr. Johnson',
      color: '#ef4444' // red color
    }
  ];

  // Sample appointments/events
  const events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Annual Checkup',
      start: new Date(2024, 0, 15, 10, 0), // Jan 15, 2024, 10:00 AM
      end: new Date(2024, 0, 15, 11, 0),   // Jan 15, 2024, 11:00 AM
      personId: 'doctor1'
    },
    {
      id: '2',
      title: 'Dental Cleaning',
      start: new Date(2024, 0, 15, 14, 30), // Jan 15, 2024, 2:30 PM
      end: new Date(2024, 0, 15, 15, 30),   // Jan 15, 2024, 3:30 PM
      personId: 'doctor2'
    },
    {
      id: '3',
      title: 'Follow-up Visit',
      start: new Date(2024, 0, 16, 9, 0),   // Jan 16, 2024, 9:00 AM
      end: new Date(2024, 0, 16, 9, 30),    // Jan 16, 2024, 9:30 AM
      personId: 'doctor1'
    }
  ];

  const handleEventClick = (event: CalendarEvent) => {
    console.log('Appointment clicked:', event);
  };

  const handleAddAppointment = (date: Date) => {
    console.log('Add appointment clicked for date:', date);
  };

  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1)); // Initial fixed date

  useEffect(() => {
    setCurrentDate(new Date()); // Update to current date after mount
  }, []);

  return (
    <div className="h-screen w-full p-4 bg-white">
      <Calendar
        defaultDate={currentDate}
        events={events}
        people={people}
        defaultSelectedPersonIds={['doctor1', 'doctor2']}
        onAddAppointment={handleAddAppointment}
      >
        <div className="flex h-full flex-col space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Person selector and view controls */}
            <div className="flex flex-wrap justify-center items-center gap-2 w-full sm:w-auto">
              <CalendarPersonSelector className="w-full sm:w-auto" />
              <div className="flex flex-wrap justify-center items-center gap-1">
                <CalendarViewTrigger
                  className="h-8 px-2 aria-[current=true]:bg-accent sm:px-3"
                  view="day"
                >
                  Day
                </CalendarViewTrigger>
                <CalendarViewTrigger
                  view="week"
                  className="h-8 px-2 aria-[current=true]:bg-accent sm:px-3"
                >
                  Week
                </CalendarViewTrigger>
                <CalendarViewTrigger
                  view="month"
                  className="h-8 px-2 aria-[current=true]:bg-accent sm:px-3 hidden md:flex"
                >
                  Month
                </CalendarViewTrigger>
                <CalendarViewTrigger
                  view="year"
                  className="h-8 px-2 aria-[current=true]:bg-accent sm:px-3"
                >
                  Year
                </CalendarViewTrigger>
              </div>
            </div>

            {/* Navigation controls */}
            <div className="flex flex-wrap justify-center items-center gap-2 w-full sm:w-auto sm:justify-end">
              <CalendarCurrentDate className="text-center sm:text-right min-w-24" />
              <div className="flex items-center gap-1">
                <CalendarPrevTrigger className="h-8 w-8">
                  <ChevronLeft className="lucide lucide-chevron-left" size={18} />
                  <span className="sr-only">Previous</span>
                </CalendarPrevTrigger>

                <CalendarTodayTrigger className="h-8 px-2 sm:px-3">
                  Today
                </CalendarTodayTrigger>

                <CalendarNextTrigger className="h-8 w-8">
                  <ChevronRight className="lucide lucide-chevron-right" size={18} />
                  <span className="sr-only">Next</span>
                </CalendarNextTrigger>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <CalendarDayView />
            <CalendarWeekView />
            <CalendarMonthView />
            <CalendarYearView />
          </div>
        </div>
      </Calendar>
    </div>
  );
};

export default App;
```

## Props

### Calendar Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | Required | Calendar content |
| `defaultDate` | `Date` | `new Date()` | Initial date to display |
| `events` | `CalendarEvent[]` | `[]` | Array of calendar events |
| `view` | `'month' \| 'week' \| 'day' \| 'year'` | `'month'` | Default calendar view |
| `locale` | `Locale` | `enUS` | Calendar localization |
| `enableHotkeys` | `boolean` | `true` | Enable keyboard shortcuts |
| `onChangeView` | `(view: View) => void` | - | View change callback |
| `onEventClick` | `(event: CalendarEvent) => void` | - | Event click callback |
| `people` | `Person[]` | Required | Array of people |
| `defaultSelectedPersonIds` | `string[]` | `[]` | Initially selected person IDs |
| `onAddAppointment` | `(date: Date) => void` | - | Appointment creation callback |

### Types

```typescript
interface CalendarEvent {
  id: string;
  start: Date;
  end: Date;
  title: string;
  personId: string;
  color?: string;
}

interface Person {
  id: string;
  name: string;
  color?: string;
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC
