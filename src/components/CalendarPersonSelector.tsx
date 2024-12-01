import { useContext } from 'react';
import { CalendarContext } from '../context/CalendarContext';
import { Button } from './ui/button';
import { ChevronDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from './ui/dropdown-menu';
import { cn } from '../lib/utils';

interface CalendarPersonSelectorProps {
    className?: string;
    buttonClassName?: string;
    dropdownClassName?: string;
}

export function CalendarPersonSelector({
    className,
    buttonClassName,
    dropdownClassName,
}: CalendarPersonSelectorProps) {
    const { people, selectedPersonIds, setSelectedPersonIds } =
        useContext(CalendarContext);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        'flex items-center gap-2',
                        buttonClassName
                    )}
                >
                    People
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className={cn('min-w-[200px]', dropdownClassName)}
            >
                {people.map((person) => (
                    <DropdownMenuCheckboxItem
                        key={person.id}
                        checked={selectedPersonIds.includes(person.id)}
                        onCheckedChange={(checked) => {
                            if (checked) {
                                setSelectedPersonIds([
                                    ...selectedPersonIds,
                                    person.id,
                                ]);
                            } else {
                                setSelectedPersonIds(
                                    selectedPersonIds.filter(
                                        (id) => id !== person.id
                                    )
                                );
                            }
                        }}
                    >
                        {person.name}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
