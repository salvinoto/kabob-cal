import { cva } from 'class-variance-authority';

export const monthEventVariants = cva('size-2 rounded-full', {
    variants: {
        variant: {
            default: 'bg-primary',
            blue: 'bg-blue-500',
            green: 'bg-green-500',
            pink: 'bg-pink-500',
            purple: 'bg-purple-500',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});

export const dayEventVariants = cva('font-bold border-l-4 rounded p-2 text-xs', {
    variants: {
        variant: {
            default: 'bg-muted/30 text-muted-foreground border-muted',
            blue: 'bg-blue-500/30 text-blue-600 border-blue-500',
            green: 'bg-green-500/30 text-green-600 border-green-500',
            pink: 'bg-pink-500/30 text-pink-600 border-pink-500',
            purple: 'bg-purple-500/30 text-purple-600 border-purple-500',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});
