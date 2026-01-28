'use client';

import type { ButtonBlockProps } from '@/types';
import {
  PropertySection,
  SpacingEditor,
  AlignEditor,
  TextInput,
  NumberInput,
  ColorPicker,
} from '../PropertyEditor';

export interface ButtonEditorProps {
  props: ButtonBlockProps;
  onChange: (props: Partial<ButtonBlockProps>) => void;
}

export function ButtonEditor({ props, onChange }: ButtonEditorProps) {
  return (
    <>
      <PropertySection title="Button">
        <TextInput
          label="Button Text"
          value={props.text}
          onChange={(value) => onChange({ text: value })}
        />
        <TextInput
          label="Link URL"
          value={props.linkUrl}
          onChange={(value) => onChange({ linkUrl: value })}
          placeholder="https://..."
        />
      </PropertySection>
      <PropertySection title="Style">
        <ColorPicker
          label="Background Color"
          value={props.backgroundColor}
          onChange={(value) => onChange({ backgroundColor: value })}
        />
        <ColorPicker
          label="Text Color"
          value={props.textColor}
          onChange={(value) => onChange({ textColor: value })}
        />
        <NumberInput
          label="Font Size"
          value={props.fontSize}
          onChange={(value) => onChange({ fontSize: value })}
          min={8}
          max={48}
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
        <AlignEditor
          label="Alignment"
          value={props.align}
          onChange={(value) => onChange({ align: value })}
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
