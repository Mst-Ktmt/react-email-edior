'use client';

interface FontWeightSelectProps {
  label?: string;
  value: string | number;
  onChange: (value: string) => void;
}

const WEIGHT_OPTIONS = [
  { value: '300', label: 'Light' },
  { value: '400', label: 'Regular' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semi Bold' },
  { value: '700', label: 'Bold' },
  { value: '800', label: 'Extra Bold' },
];

export function FontWeightSelect({ label = 'Font Weight', value, onChange }: FontWeightSelectProps) {
  const stringValue = String(value);

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-gray-600">{label}</span>
      <select
        value={stringValue}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {WEIGHT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value} style={{ fontWeight: option.value }}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
