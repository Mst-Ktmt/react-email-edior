'use client';

import { ChangeEvent, useId, useState } from 'react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function ColorPicker({
  label,
  value,
  onChange,
  disabled = false,
  className = '',
}: ColorPickerProps) {
  const id = useId();
  const [inputValue, setInputValue] = useState(value);

  const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (/^#[0-9A-Fa-f]{6}$/.test(newValue)) {
      onChange(newValue);
    }
  };

  const handleBlur = () => {
    setInputValue(value);
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label
        htmlFor={id}
        className="text-xs font-medium text-gray-600"
      >
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={handleColorChange}
          disabled={disabled}
          className="w-8 h-8 rounded border border-gray-300 cursor-pointer disabled:cursor-not-allowed"
        />
        <input
          id={id}
          type="text"
          value={inputValue}
          onChange={handleTextChange}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder="#000000"
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed font-mono"
        />
      </div>
    </div>
  );
}
