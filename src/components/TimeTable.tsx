import { ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';

interface TimeTableProps {
    onTimeClick?: (hour: Date) => void;
}

export const TimeTable = ({ onTimeClick }: TimeTableProps) => {
    const now = new Date();

    return (
        <div className="flex flex-1">
            {/* Time labels column */}
            <div className="pr-2 w-12 relative">
                {Array.from(Array(24).keys()).map((hour) => (
                    <div
                        key={`label-${hour}`}
                        className="h-20 relative text-xs text-muted-foreground/50"
                    >
                        <div className="absolute -top-2 right-0">
                            {hour}:00
                        </div>
                    </div>
                ))}
            </div>

            {/* Droppable time slots */}
            <div className="flex-1 relative">
                {Array.from(Array(24).keys()).map((hour) => {
                    const { setNodeRef, isOver } = useDroppable({
                        id: `time-${hour}`,
                        data: { hour }
                    });

                    return (
                        <div
                            ref={setNodeRef}
                            key={`slot-${hour}`}
                            className={`h-20 border-t border-border relative group ${
                                isOver ? 'bg-muted/50' : 'hover:bg-muted/20'
                            }`}
                            onClick={() => {
                                const date = new Date();
                                date.setHours(hour, 0, 0, 0);
                                onTimeClick?.(date);
                            }}
                            data-hour={hour}
                            style={{
                                zIndex: isOver ? 10 : 'auto'
                            }}
                        >
                            {now.getHours() === hour && (
                                <div
                                    className="absolute z-20 w-full h-[2px] bg-red-500"
                                    style={{
                                        top: `${(now.getMinutes() / 60) * 100}%`,
                                    }}
                                >
                                    <div className="size-2 rounded-full bg-red-500 absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
