'use client';

import type { ColumnsBlockProps, ColumnCount } from '@/types';
import {
  PropertySection,
  NumberInput,
  ResponsiveToggle,
  ColorPicker,
  SpacingEditor,
} from '../PropertyEditor';
import { defaultSpacing } from '@/types/defaults';

// Column layout presets
interface LayoutPreset {
  label: string;
  columns: number;
  widths: number[];
}

const LAYOUT_PRESETS: LayoutPreset[] = [
  // 1 column
  { label: '100', columns: 1, widths: [100] },
  // 2 columns
  { label: '50 / 50', columns: 2, widths: [50, 50] },
  { label: '33 / 67', columns: 2, widths: [33, 67] },
  { label: '67 / 33', columns: 2, widths: [67, 33] },
  { label: '25 / 75', columns: 2, widths: [25, 75] },
  { label: '75 / 25', columns: 2, widths: [75, 25] },
  // 3 columns
  { label: '33 / 33 / 33', columns: 3, widths: [33.33, 33.33, 33.34] },
  { label: '25 / 50 / 25', columns: 3, widths: [25, 50, 25] },
  { label: '50 / 25 / 25', columns: 3, widths: [50, 25, 25] },
  { label: '25 / 25 / 50', columns: 3, widths: [25, 25, 50] },
  // 4 columns
  { label: '25 / 25 / 25 / 25', columns: 4, widths: [25, 25, 25, 25] },
];

export interface ColumnsEditorProps {
  props: ColumnsBlockProps;
  onChange: (props: Partial<ColumnsBlockProps>) => void;
}

export function ColumnsEditor({ props, onChange }: ColumnsEditorProps) {
  const currentWidths = props.columnWidths || [];
  const currentCount = props.columnCount || 2;

  const handlePresetSelect = (preset: LayoutPreset) => {
    onChange({
      columnCount: preset.columns as ColumnCount,
      columnWidths: preset.widths,
    });
  };

  const handleColumnCountChange = (count: ColumnCount) => {
    // Generate equal widths for the new count
    const equalWidth = 100 / count;
    const widths = Array.from({ length: count }, () => equalWidth);
    onChange({
      columnCount: count,
      columnWidths: widths,
    });
  };

  const isPresetSelected = (preset: LayoutPreset): boolean => {
    if (preset.columns !== currentCount) return false;
    if (preset.widths.length !== currentWidths.length) return false;
    return preset.widths.every((w, i) => Math.abs(w - currentWidths[i]) < 1);
  };

  return (
    <>
      <PropertySection title="Layout">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-gray-600">Column Count</span>
          <div className="flex gap-1">
            {([1, 2, 3, 4] as ColumnCount[]).map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => handleColumnCountChange(count)}
                className={`flex-1 py-2 text-sm rounded-md border ${
                  currentCount === count
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <span className="text-xs font-medium text-gray-600">Preset Layouts</span>
          <div className="grid grid-cols-2 gap-2">
            {LAYOUT_PRESETS.filter((p) => p.columns === currentCount).map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                className={`relative p-2 rounded-md border ${
                  isPresetSelected(preset)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex gap-0.5 h-6">
                  {preset.widths.map((width, i) => (
                    <div
                      key={i}
                      className={`rounded-sm ${
                        isPresetSelected(preset) ? 'bg-blue-500' : 'bg-gray-400'
                      }`}
                      style={{ width: `${width}%` }}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-gray-500 mt-1 block">{preset.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <span className="text-xs font-medium text-gray-600">Custom Widths (%)</span>
          <div className="flex gap-1">
            {currentWidths.map((width, i) => (
              <input
                key={i}
                type="number"
                min={10}
                max={90}
                value={Math.round(width)}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value, 10);
                  if (isNaN(newValue)) return;

                  // Adjust other columns proportionally
                  const oldValue = currentWidths[i];
                  const diff = newValue - oldValue;
                  const otherTotal = 100 - oldValue;

                  const newWidths = currentWidths.map((w, j) => {
                    if (j === i) return newValue;
                    // Distribute the difference proportionally
                    const proportion = w / otherTotal;
                    return w - diff * proportion;
                  });

                  // Ensure all values are positive and sum to 100
                  const sum = newWidths.reduce((a, b) => a + b, 0);
                  const normalizedWidths = newWidths.map((w) => (w / sum) * 100);

                  onChange({ columnWidths: normalizedWidths });
                }}
                className="flex-1 w-full px-2 py-1.5 text-sm text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>
          <p className="text-xs text-gray-400">Values auto-adjust to total 100%</p>
        </div>
      </PropertySection>

      <PropertySection title="Background">
        <ColorPicker
          label="Background Color"
          value={props.backgroundColor ?? 'transparent'}
          onChange={(value) => onChange({ backgroundColor: value })}
        />
      </PropertySection>

      <PropertySection title="Padding">
        <SpacingEditor
          label="Padding"
          value={props.padding ?? defaultSpacing}
          onChange={(value) => onChange({ padding: value })}
        />
      </PropertySection>

      <PropertySection title="Spacing">
        <NumberInput
          label="Gap Between Columns"
          value={props.gap}
          onChange={(value) => onChange({ gap: value })}
          min={0}
          max={50}
          unit="px"
        />
      </PropertySection>

      <PropertySection title="Border">
        <ColorPicker
          label="Border Color"
          value={props.borderColor ?? '#cccccc'}
          onChange={(value) => onChange({ borderColor: value })}
        />
        <NumberInput
          label="Border Width"
          value={props.borderWidth ?? 0}
          onChange={(value) => onChange({ borderWidth: value })}
          min={0}
          max={10}
          unit="px"
        />
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-600">Border Style</span>
          <div className="flex gap-1">
            {(['solid', 'dashed', 'dotted'] as const).map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => onChange({ borderStyle: style })}
                className={`flex-1 py-2 text-sm rounded-md border capitalize ${
                  (props.borderStyle ?? 'solid') === style
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
        <NumberInput
          label="Border Radius"
          value={props.borderRadius ?? 0}
          onChange={(value) => onChange({ borderRadius: value })}
          min={0}
          max={50}
          unit="px"
        />
      </PropertySection>

      <PropertySection title="Alignment">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-600">Vertical Alignment</span>
          <div className="flex gap-1">
            {(['top', 'middle', 'bottom'] as const).map((align) => (
              <button
                key={align}
                type="button"
                onClick={() => onChange({ verticalAlign: align })}
                className={`flex-1 py-2 text-sm rounded-md border capitalize ${
                  props.verticalAlign === align
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {align}
              </button>
            ))}
          </div>
        </div>
      </PropertySection>

      <PropertySection title="Responsive">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm text-gray-700">Stack on Mobile</span>
          <button
            type="button"
            role="switch"
            aria-checked={props.stackOnMobile}
            onClick={() => onChange({ stackOnMobile: !props.stackOnMobile })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              props.stackOnMobile ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                props.stackOnMobile ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </label>
        <p className="text-xs text-gray-400">
          When enabled, columns stack vertically on mobile devices.
        </p>
      </PropertySection>
    </>
  );
}
