'use client';

import type { TimerBlockProps } from '@/types';
import {
  PropertySection,
  SpacingEditor,
  TextInput,
  NumberInput,
  ColorPicker,
  CheckboxInput,
} from '../PropertyEditor';

export interface TimerEditorProps {
  props: TimerBlockProps;
  onChange: (props: Partial<TimerBlockProps>) => void;
}

export function TimerEditor({ props, onChange }: TimerEditorProps) {
  // ISO文字列をdatetime-local形式に変換
  const formatDateTimeLocal = (isoString: string): string => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // datetime-local値をISO文字列に変換
  const handleDateChange = (value: string) => {
    const date = new Date(value);
    onChange({ endDate: date.toISOString() });
  };

  return (
    <>
      <PropertySection title="Timer Settings">
        <div className="space-y-2">
          <label className="block text-xs text-gray-500">End Date</label>
          <input
            type="datetime-local"
            value={formatDateTimeLocal(props.endDate)}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <TextInput
          label="Expired Message"
          value={props.expiredMessage}
          onChange={(value) => onChange({ expiredMessage: value })}
          placeholder="Time's up!"
        />
      </PropertySection>
      <PropertySection title="Display Options">
        <CheckboxInput
          label="Show Days"
          checked={props.showDays}
          onChange={(value) => onChange({ showDays: value })}
        />
        <CheckboxInput
          label="Show Hours"
          checked={props.showHours}
          onChange={(value) => onChange({ showHours: value })}
        />
        <CheckboxInput
          label="Show Minutes"
          checked={props.showMinutes}
          onChange={(value) => onChange({ showMinutes: value })}
        />
        <CheckboxInput
          label="Show Seconds"
          checked={props.showSeconds}
          onChange={(value) => onChange({ showSeconds: value })}
        />
      </PropertySection>
      <PropertySection title="Style">
        <NumberInput
          label="Font Size"
          value={props.fontSize}
          onChange={(value) => onChange({ fontSize: value })}
          min={12}
          max={72}
          unit="px"
        />
        <ColorPicker
          label="Text Color"
          value={props.textColor}
          onChange={(value) => onChange({ textColor: value })}
        />
        <ColorPicker
          label="Background Color"
          value={props.backgroundColor}
          onChange={(value) => onChange({ backgroundColor: value })}
        />
      </PropertySection>
      <PropertySection title="General">
        <SpacingEditor
          label="Padding"
          value={props.padding}
          onChange={(value) => onChange({ padding: value })}
        />
      </PropertySection>
    </>
  );
}
