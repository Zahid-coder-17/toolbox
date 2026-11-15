import React from 'react';
import { cn } from '@/lib/utils';

export interface SliderProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  valueDisplay?: string | number;
}

export function Slider({
  className,
  label,
  valueDisplay,
  id,
  ...props
}: SliderProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {(label || valueDisplay !== undefined) && (
        <div className="flex justify-between items-center text-sm font-medium text-slate-700">
          {label && <label htmlFor={inputId}>{label}</label>}
          {valueDisplay !== undefined && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
              {valueDisplay}
            </span>
          )}
        </div>
      )}
      <input
        id={inputId}
        type="range"
        className={cn(
          'w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600',
          className
        )}
        {...props}
      />
    </div>
  );
}
