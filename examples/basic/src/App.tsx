import React, { useState, useEffect } from 'react';
import { Calendar, CalendarCurrentDate, CalendarDayView, CalendarEvent, CalendarMonthView, CalendarNextTrigger, CalendarPersonSelector, CalendarPrevTrigger, CalendarTodayTrigger, CalendarViewTrigger, CalendarWeekView, CalendarYearView, Person } from 'kabob-cal';
import 'kabob-cal/dist/globals.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Annual Checkup',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0),
      personId: 'doctor1'
    },
    {
      id: '2',
      title: 'Dental Cleaning',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 30),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 30),
      personId: 'doctor2'
    }
  ]);

  const handleEventClick = (event: CalendarEvent) => {
    console.log('Appointment clicked:', event);
  };

  const handleAddAppointment = (date: Date) => {
    const newEvent: CalendarEvent = {
      id: String(Date.now()),
      title: 'New Appointment',
      start: date,
      end: new Date(date.getTime() + 60 * 60 * 1000), // 1 hour duration
      personId: people[0].id
    };

    setEvents(prevEvents => [...prevEvents, newEvent]);
  };

  const handleUpdateEvent = (updatedEvent: CalendarEvent) => {
    console.log('Updating event:', updatedEvent);
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  return (
    <div className="h-screen w-full p-4 bg-white">
      <Calendar
        defaultDate={currentDate}
        events={events}
        people={people}
        defaultSelectedPersonIds={['doctor1', 'doctor2']}
        onAddAppointment={handleAddAppointment}
        onEventClick={handleEventClick}
        onUpdateEvent={handleUpdateEvent}
      >
        <div className="flex h-full flex-col space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
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
