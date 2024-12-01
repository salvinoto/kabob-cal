# Kabob Calendar

A modern, flexible, and customizable calendar component library for React applications. Built with TypeScript and featuring multiple view modes, person management, and event handling capabilities.

## Features

- 📅 Multiple calendar views (Day, Week, Month, Year)
- 👥 Built-in person/resource management with filtering
- 🎨 Customizable event colors and styling
- 🎯 Event click handling and appointment creation
- 🔄 Intuitive navigation controls
- 📱 Responsive design with modern UI components
- 💅 Built with Tailwind CSS and Shadcn UI.

## Installation

```bash
npm install kabob-cal
# or
yarn add kabob-cal
# or
pnpm add kabob-cal
```

## Requirements

- React ^18.2.0
- React DOM ^18.2.0
- Tailwind CSS (for styling)

## Usage Example

Here's a complete example showing how to create a medical appointment calendar with multiple doctors:

```tsx
import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CalendarCurrentDate,
  CalendarDayView,
  CalendarEvent,
  CalendarMonthView,
  CalendarNextTrigger,
  CalendarPersonSelector,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarViewTrigger,
  CalendarWeekView,
  CalendarYearView,
  Person
} from 'kabob-cal';
import 'kabob-cal/dist/globals.css';

const App = () => {
  // Define people (e.g., doctors)
  const people: Person[] = [
    {
      id: 'doctor1',
      name: 'Dr. Smith',
      color: 'blue'
    },
    {
      id: 'doctor2',
      name: 'Dr. Johnson',
      color: 'pink'
    }
  ];

  // Define calendar events/appointments
  const events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Annual Checkup',
      start: new Date(2024, 0, 15, 10, 0),
      end: new Date(2024, 0, 15, 11, 0),
      personId: 'doctor1'
    },
    {
      id: '2',
      title: 'Dental Cleaning',
      start: new Date(2024, 0, 15, 14, 30),
      end: new Date(2024, 0, 15, 15, 30),
      personId: 'doctor2'
    }
  ];

  const handleEventClick = (event: CalendarEvent) => {
    console.log('Appointment clicked:', event);
  };

  const handleAddAppointment = (date: Date) => {
    console.log('Add appointment clicked for date:', date);
  };

  return (
    <div className="h-screen w-full p-4 bg-white">
      <Calendar
        defaultDate={new Date()}
        events={events}
        people={people}
        defaultSelectedPersonIds={['doctor1', 'doctor2']}
        onAddAppointment={handleAddAppointment}
      >
        <div className="flex h-full flex-col space-y-4">
          {/* Person selector and view controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap justify-center items-center gap-2 w-full sm:w-auto">
              <CalendarPersonSelector className="w-full sm:w-auto" />
              <div className="flex flex-wrap justify-center items-center gap-1">
                <CalendarViewTrigger view="day">Day</CalendarViewTrigger>
                <CalendarViewTrigger view="week">Week</CalendarViewTrigger>
                <CalendarViewTrigger view="month">Month</CalendarViewTrigger>
                <CalendarViewTrigger view="year">Year</CalendarViewTrigger>
              </div>
            </div>
          </div>

          {/* Calendar views */}
          <CalendarDayView />
          <CalendarWeekView />
          <CalendarMonthView />
          <CalendarYearView />
        </div>
      </Calendar>
    </div>
  );
};

export default App;
```

## Component API

### Calendar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `events` | `CalendarEvent[]` | Required | Array of calendar events |
| `people` | `Person[]` | Required | Array of people/resources |
| `defaultDate` | `Date` | `new Date()` | Initial calendar date |
| `defaultSelectedPersonIds` | `string[]` | `[]` | Initially selected person IDs |
| `onAddAppointment` | `(date: Date) => void` | - | Callback when adding appointments |
| `onEventClick` | `(event: CalendarEvent) => void` | - | Callback when clicking events |

### Types

```typescript
interface Person {
  id: string;
  name: string;
  color: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  personId: string;
}
```

## License

MIT
