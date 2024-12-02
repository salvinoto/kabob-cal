import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CalendarEvent, Person } from '../types';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { monthEventVariants, dayEventVariants } from './ui/variants';

interface DraggableEventProps {
    event: CalendarEvent;
    person?: Person;
    view: 'day' | 'week' | 'month';
    style?: React.CSSProperties;
}

export function DraggableEvent({ event, person, view, style }: DraggableEventProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: event.id,
        data: { event },
    });

    const dragStyle: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
        ...style,
    };

    if (view === 'month') {
        return (
            <div
                ref={setNodeRef}
                style={dragStyle}
                {...attributes}
                {...listeners}
                className="px-1 rounded text-sm flex items-center gap-1"
            >
                <div
                    className={cn(
                        'shrink-0',
                        monthEventVariants({ variant: person?.color || event.color })
                    )}
                ></div>
                <span className="flex-1 truncate">{event.title}</span>
                <span className="text-xs text-muted-foreground">{person?.name}</span>
                <time className="tabular-nums text-muted-foreground/50 text-xs">
                    {format(event.start, 'HH:mm')}
                </time>
            </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={dragStyle}
            {...attributes}
            {...listeners}
            className={cn(
                'relative',
                dayEventVariants({ variant: person?.color || event.color })
            )}
        >
            <div className="text-xs font-semibold">{event.title}</div>
            <div className="text-xs">{person?.name}</div>
        </div>
    );
} 