import { ReactNode } from 'react';
import { DroppableHourSlot } from './DroppableHourSlot';
import { setHours, isToday } from 'date-fns';

interface TimeTableProps {
    onTimeClick?: (hour: Date) => void;
    showCurrentTime?: boolean;
}

export const TimeTable = ({ onTimeClick, showCurrentTime }: TimeTableProps) => {
    const now = new Date();
    const hours = Array.from(Array(24).keys()).map(hour => setHours(now, hour));

    return (
        <div className="flex flex-1">
            {/* Time labels column */}
            <div className="pr-2 w-12 relative">
                {hours.map((hour) => (
                    <div
                        key={`label-${hour.getHours()}`}
                        className="h-20 relative text-xs text-muted-foreground/50"
                    >
                        <div className="absolute -top-2 right-0">
                            {hour.getHours()}:00
                        </div>
                    </div>
                ))}
            </div>

            {/* Droppable time slots */}
            <div className="flex-1 relative">
                {hours.map((hour) => (
                    <DroppableHourSlot
                        key={hour.toString()}
                        hour={hour}
                        isToday={isToday(hour)}
                        onTimeClick={onTimeClick || (() => {})}
                        className="hover:bg-muted/20"
                        showCurrentTime={showCurrentTime}
                    />
                ))}
            </div>
        </div>
    );
};
