import { ChangeEvent, useId } from 'react';

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function TextInput({
  label,
  value,
  onChange,
  placeholder = '',
  disabled = false,
  className = '',
}: TextInputProps) {
  const id = useId();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label
        htmlFor={id}
        className="text-xs font-medium text-gray-600"
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </div>
  );
}
