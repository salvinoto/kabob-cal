import { forwardRef, useCallback } from 'react';
import { Button } from './ui/button';
import { useCalendar } from '../context/CalendarContext';
import { subDays, subMonths, subWeeks, subYears } from 'date-fns';
import { useHotkeys } from 'react-hotkeys-hook';

export const CalendarPrevTrigger = forwardRef<
    HTMLButtonElement,
    React.HTMLAttributes<HTMLButtonElement>
>(({ children, onClick, ...props }, ref) => {
    const { date, setDate, view, enableHotkeys } = useCalendar();

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

    useHotkeys('ArrowLeft', () => prev(), {
        enabled: enableHotkeys,
    });

    return (
        <Button
            size="icon"
            variant="ghost"
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
