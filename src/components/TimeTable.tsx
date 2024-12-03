import { ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';

interface TimeTableProps {
    children?: ReactNode;
}

export const TimeTable = () => {
    const now = new Date();

    return (
        <div className="pr-2 w-12">
            {Array.from(Array(25).keys()).map((hour) => {
                const { setNodeRef } = useDroppable({
                    id: `time-${hour}`,
                    data: { hour }
                });

                return (
                    <div
                        ref={setNodeRef}
                        className="text-right relative text-xs text-muted-foreground/50 h-20 last:h-0"
                        key={hour}
                    >
                        {now.getHours() === hour && (
                            <div
                                className="absolute z-10 left-full translate-x-2 w-dvw h-[2px] bg-red-500"
                                style={{
                                    top: `${(now.getMinutes() / 60) * 100}%`,
                                }}
                            >
                                <div className="size-2 rounded-full bg-red-500 absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                            </div>
                        )}
                        <p className="top-0 -translate-y-1/2">
                            {hour === 24 ? 0 : hour}:00
                        </p>
                    </div>
                );
            })}
        </div>
    );
};
