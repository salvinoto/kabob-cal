import { useCalendar } from '../context/CalendarContext';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { cn } from '../lib/utils';

type CalendarCurrentDateProps = {
    className?: string;
};

export const CalendarCurrentDate = ({ className }: CalendarCurrentDateProps) => {
    const { date, view, locale } = useCalendar();

    const getDateDisplay = () => {
        switch (view) {
            case 'day':
                return format(date, 'EEEE, MMMM d, yyyy', { locale });
            case 'week': {
                const start = startOfWeek(date, { weekStartsOn: 0 });
                const end = endOfWeek(date, { weekStartsOn: 0 });
                const sameMonth = format(start, 'M') === format(end, 'M');
                const sameYear = format(start, 'yyyy') === format(end, 'yyyy');

                if (sameMonth && sameYear) {
                    return `${format(start, 'MMMM d')} - ${format(end, 'd, yyyy')}`;
                } else if (sameYear) {
                    return `${format(start, 'MMMM d')} - ${format(end, 'MMMM d, yyyy')}`;
                } else {
                    return `${format(start, 'MMMM d, yyyy')} - ${format(end, 'MMMM d, yyyy')}`;
                }
            }
            case 'month':
                return format(date, 'MMMM yyyy', { locale });
            case 'year':
                return format(date, 'yyyy', { locale });
            default:
                return format(date, 'MMMM yyyy', { locale });
        }
    };

    return (
        <time 
            dateTime={date.toISOString()} 
            className={cn("tabular-nums text-2xl font-bold", className)}
        >
            {getDateDisplay()}
        </time>
    );
};
