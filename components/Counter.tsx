import React from 'react';

interface CounterProps {
  label: string;
  count: number;
  onCountChange: (newCount: number) => void;
  helpText: string;
  disabled?: boolean;
}

export const Counter: React.FC<CounterProps> = ({ label, count, onCountChange, helpText, disabled = false }) => {
  const increment = () => !disabled && onCountChange(count + 1);
  const decrement = () => !disabled && onCountChange(Math.max(0, count - 1));

  const containerClasses = `p-4 rounded-lg ${disabled ? 'bg-slate-100 dark:bg-slate-800/50' : 'bg-slate-50 dark:bg-slate-700/50'}`;
  const labelClasses = `font-semibold ${disabled ? 'text-slate-500 dark:text-slate-400' : 'text-slate-800 dark:text-slate-200'}`;
  const helpTextClasses = `text-xs ${disabled ? 'text-slate-400' : 'text-slate-500'} dark:text-slate-400`;

  return (
    <div className={containerClasses}>
      <div className="flex items-center justify-between">
        <div>
          <p className={labelClasses}>{label}</p>
          <p className={helpTextClasses}>{helpText}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={decrement}
            className="w-10 h-10 rounded-full bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-110 text-2xl flex items-center justify-center pb-[1px]"
            disabled={count === 0 || disabled}
            aria-label={`Decrease ${label}`}
          >
            -
          </button>
          <span className="text-2xl font-semibold text-slate-700 dark:text-slate-100 w-10 text-center">{count}</span>
          <button
            onClick={increment}
            className="w-10 h-10 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-transform hover:scale-110 text-2xl flex items-center justify-center pb-[2px]"
            aria-label={`Increase ${label}`}
            disabled={disabled}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};
