'use client';

import type { DividerBlockProps } from '@/types';
import {
  PropertySection,
  SpacingEditor,
  NumberInput,
  ColorPicker,
} from '../PropertyEditor';

export interface DividerEditorProps {
  props: DividerBlockProps;
  onChange: (props: Partial<DividerBlockProps>) => void;
}

export function DividerEditor({ props, onChange }: DividerEditorProps) {
  return (
    <>
      <PropertySection title="Line Style">
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
      </PropertySection>
      <PropertySection title="Spacing">
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
    </>
  );
}
