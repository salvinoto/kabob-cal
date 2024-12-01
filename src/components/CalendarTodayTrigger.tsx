import { forwardRef, useCallback } from 'react';
import { Button } from './ui/button';
import { useCalendar } from '../context/CalendarContext';
import { useHotkeys } from 'react-hotkeys-hook';

export const CalendarTodayTrigger = forwardRef<
    HTMLButtonElement,
    React.HTMLAttributes<HTMLButtonElement>
>(({ children, onClick, ...props }, ref) => {
    const { setDate, enableHotkeys, today } = useCalendar();

    const jumpToToday = useCallback(() => {
        setDate(today);
    }, [today, setDate]);

    useHotkeys('t', () => jumpToToday(), {
        enabled: enableHotkeys,
    });

    return (
        <Button
            variant="ghost"
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
