import { ChangeEvent, useId } from 'react';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  disabled?: boolean;
  className?: string;
}

export function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  disabled = false,
  className = '',
}: NumberInputProps) {
  const id = useId();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label
        htmlFor={id}
        className="text-xs font-medium text-gray-600"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="number"
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed pr-10"
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
