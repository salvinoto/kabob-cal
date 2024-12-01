import { useContext } from 'react';
import { Button } from './ui/button';
import { CalendarContext } from '../context/CalendarContext';
import { View } from '../types';
import { cn } from '../lib/utils';

type CalendarViewTriggerProps = {
    view: View;
    children: React.ReactNode;
    className?: string;
};

export function CalendarViewTrigger({
    view: targetView,
    children,
    className,
}: CalendarViewTriggerProps) {
    const { view, setView, onChangeView } = useContext(CalendarContext);

    const handleClick = () => {
        setView(targetView);
        onChangeView?.(targetView);
    };

    return (
        <Button
            variant="ghost"
            onClick={handleClick}
            className={cn(className)}
            aria-current={view === targetView}
        >
            {children}
        </Button>
    );
}
