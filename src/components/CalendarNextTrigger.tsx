import { forwardRef, useCallback } from 'react';
import { Button } from './ui/button';
import { useCalendar } from '../context/CalendarContext';
import { addDays, addMonths, addWeeks, addYears } from 'date-fns';
import { useHotkeys } from 'react-hotkeys-hook';

export const CalendarNextTrigger = forwardRef<
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
            variant="ghost"
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
