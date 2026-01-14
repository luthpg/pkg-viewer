import React from 'react';
import { cn } from '../../lib/utils';

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'relative w-full rounded-2xl border border-gray-200/60 bg-white p-6 text-left shadow-lg shadow-gray-900/5',
        'dark:border-slate-700/50 dark:bg-slate-800/80 dark:shadow-slate-900/30',
        className,
      )}
      {...props}
    />
  );
});
Card.displayName = 'Card';
