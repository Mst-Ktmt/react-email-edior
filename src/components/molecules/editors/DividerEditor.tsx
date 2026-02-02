'use client';

import type { DividerBlockProps } from '@/types';
import {
  PropertySection,
  SpacingEditor,
  AlignEditor,
  NumberInput,
  ColorPicker,
  ResponsiveToggle,
} from '../PropertyEditor';

export interface DividerEditorProps {
  props: DividerBlockProps;
  onChange: (props: Partial<DividerBlockProps>) => void;
}

export function DividerEditor({ props, onChange }: DividerEditorProps) {
  return (
    <>
      <PropertySection title="Line">
        <NumberInput
          label="Width"
          value={typeof props.width === 'number' ? props.width : 100}
          onChange={(value) => onChange({ width: value })}
          min={10}
          max={100}
          unit="%"
        />
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-600">Line Style</span>
          <select
            value={props.style}
            onChange={(e) => onChange({ style: e.target.value as 'solid' | 'dashed' | 'dotted' })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
          </select>
        </div>
        <NumberInput
          label="Thickness"
          value={props.thickness}
          onChange={(value) => onChange({ thickness: value })}
          min={1}
          max={10}
          unit="px"
        />
        <ColorPicker
          label="Color"
          value={props.color}
          onChange={(value) => onChange({ color: value })}
        />
        <AlignEditor
          label="Alignment"
          value={props.align ?? 'center'}
          onChange={(value) => onChange({ align: value })}
        />
      </PropertySection>
      <PropertySection title="General">
        <SpacingEditor
          label="Padding"
          value={props.padding}
          onChange={(value) => onChange({ padding: value })}
        />
        <NumberInput
          label="Margin Bottom"
          value={props.marginBottom ?? 0}
          onChange={(value) => onChange({ marginBottom: value })}
          min={0}
          max={200}
          unit="px"
        />
      </PropertySection>
      <PropertySection title="Responsive Design">
        <ResponsiveToggle
          hideOnDesktop={props.hideOnDesktop ?? false}
          hideOnMobile={props.hideOnMobile ?? false}
          onChangeDesktop={(value) => onChange({ hideOnDesktop: value })}
          onChangeMobile={(value) => onChange({ hideOnMobile: value })}
        />
      </PropertySection>
    </>
  );
}
