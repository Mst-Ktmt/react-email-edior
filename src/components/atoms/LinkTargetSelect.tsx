'use client';

interface LinkTargetSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}

const TARGET_OPTIONS = [
  { value: '_self', label: 'Same Tab' },
  { value: '_blank', label: 'New Tab' },
];

export function LinkTargetSelect({ label = 'Link Target', value, onChange }: LinkTargetSelectProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-gray-600">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {TARGET_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
