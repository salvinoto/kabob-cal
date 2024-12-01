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
      color: 'blue' // indigo color
    },
    {
      id: 'doctor2',
      name: 'Dr. Johnson',
      color: 'pink' // red color
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
