'use client';

import type { SectionBlockProps } from '@/types';
import {
  PropertySection,
  ColorPicker,
  NumberInput,
  SpacingEditor,
} from '../PropertyEditor';

export interface SectionEditorProps {
  props: SectionBlockProps;
  onChange: (props: Partial<SectionBlockProps>) => void;
}

export function SectionEditor({ props, onChange }: SectionEditorProps) {
  return (
    <>
      <PropertySection title="Background">
        <ColorPicker
          label="Background Color"
          value={props.backgroundColor}
          onChange={(value) => onChange({ backgroundColor: value })}
        />
      </PropertySection>

      <PropertySection title="Size">
        <NumberInput
          label="Max Width"
          value={props.maxWidth}
          onChange={(value) => onChange({ maxWidth: value })}
          min={320}
          max={900}
          unit="px"
        />
      </PropertySection>

      <PropertySection title="Padding">
        <SpacingEditor
          label="Padding"
          value={props.padding}
          onChange={(value) => onChange({ padding: value })}
        />
      </PropertySection>

      <PropertySection title="Border">
        <ColorPicker
          label="Border Color"
          value={props.borderColor}
          onChange={(value) => onChange({ borderColor: value })}
        />
        <NumberInput
          label="Border Width"
          value={props.borderWidth}
          onChange={(value) => onChange({ borderWidth: value })}
          min={0}
          max={10}
          unit="px"
        />
        <NumberInput
          label="Border Radius"
          value={props.borderRadius}
          onChange={(value) => onChange({ borderRadius: value })}
          min={0}
          max={50}
          unit="px"
        />
      </PropertySection>
    </>
  );
}
