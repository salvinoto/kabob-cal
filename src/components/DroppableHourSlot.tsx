import { useDroppable } from '@dnd-kit/core';
import { cn } from '../lib/utils';

interface DroppableHourSlotProps {
    hour: Date;
    isToday: boolean;
    onTimeClick: (hour: Date) => void;
    children?: React.ReactNode;
    className?: string;
    showCurrentTime?: boolean;
}

export const DroppableHourSlot = ({ 
    hour, 
    isToday, 
    onTimeClick, 
    children, 
    className,
    showCurrentTime = false
}: DroppableHourSlotProps) => {
    const { setNodeRef, isOver } = useDroppable({
        id: hour.toString(),
        data: { hour: hour.getHours(), date: hour }
    });

    const now = new Date();
    const showTimeIndicator = showCurrentTime && 
        isToday && 
        now.getHours() === hour.getHours();

    return (
        <div
            ref={setNodeRef}
            id={hour.toString()}
            className={cn(
                'h-20 border-t border-border relative group transition-colors',
                isToday && 'bg-muted/5',
                isOver && 'bg-muted/20',
                className
            )}
            onClick={() => onTimeClick(hour)}
            data-hour={hour.getHours()}
            style={{
                zIndex: isOver ? 10 : 'auto'
            }}
        >
            {showTimeIndicator && (
                <div
                    className="absolute z-20 w-full h-[2px] bg-red-500"
                    style={{
                        top: `${(now.getMinutes() / 60) * 100}%`,
                    }}
                >
                    <div className="size-2 rounded-full bg-red-500 absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
            )}
            {children}
        </div>
    );
};
