'use client';

import { TextInput } from '../atoms/TextInput';
import { NumberInput } from '../atoms/NumberInput';
import { ColorPicker } from '../atoms/ColorPicker';

// ========================================
// 暫定型定義（types/props.ts 実装後に移行予定）
// ========================================

interface Spacing {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

type AlignValue = 'left' | 'center' | 'right';

// ========================================
// SpacingEditor
// ========================================

interface SpacingEditorProps {
  label: string;
  value: Spacing;
  onChange: (value: Spacing) => void;
}

export function SpacingEditor({ label, value, onChange }: SpacingEditorProps) {
  const handleChange = (key: keyof Spacing) => (newValue: number) => {
    onChange({ ...value, [key]: newValue });
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-gray-600">{label}</span>
      <div className="grid grid-cols-2 gap-2">
        <NumberInput
          label="Top"
          value={value.top}
          onChange={handleChange('top')}
          min={0}
          unit="px"
        />
        <NumberInput
          label="Right"
          value={value.right}
          onChange={handleChange('right')}
          min={0}
          unit="px"
        />
        <NumberInput
          label="Bottom"
          value={value.bottom}
          onChange={handleChange('bottom')}
          min={0}
          unit="px"
        />
        <NumberInput
          label="Left"
          value={value.left}
          onChange={handleChange('left')}
          min={0}
          unit="px"
        />
      </div>
    </div>
  );
}

// ========================================
// AlignEditor
// ========================================

interface AlignEditorProps {
  label: string;
  value: AlignValue;
  onChange: (value: AlignValue) => void;
}

export function AlignEditor({ label, value, onChange }: AlignEditorProps) {
  const options: { value: AlignValue; icon: string }[] = [
    { value: 'left', icon: '⬅' },
    { value: 'center', icon: '⬌' },
    { value: 'right', icon: '➡' },
  ];

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-gray-600">{label}</span>
      <div className="flex gap-1">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex-1 py-2 text-sm rounded-md border ${
              value === option.value
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {option.icon}
          </button>
        ))}
      </div>
    </div>
  );
}

// ========================================
// PropertySection
// ========================================

interface PropertySectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function PropertySection({
  title,
  children,
  defaultOpen = true,
}: PropertySectionProps) {
  return (
    <div className="border-b border-gray-200">
      <div className="p-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          {title}
        </h3>
        <div className="flex flex-col gap-4">{children}</div>
      </div>
    </div>
  );
}

// ========================================
// Re-export atoms for convenience
// ========================================

export { TextInput, NumberInput, ColorPicker };
