'use client';

import type { TextBlockProps } from '@/types';
import {
  PropertySection,
  SpacingEditor,
  AlignEditor,
  TextInput,
  NumberInput,
  ColorPicker,
  FontFamilySelect,
  FontWeightSelect,
  LetterSpacingInput,
  ResponsiveToggle,
} from '../PropertyEditor';

export interface TextEditorProps {
  props: TextBlockProps;
  onChange: (props: Partial<TextBlockProps>) => void;
}

export function TextEditor({ props, onChange }: TextEditorProps) {
  return (
    <>
      <PropertySection title="Content">
        <TextInput
          label="Text Content"
          value={props.content}
          onChange={(value) => onChange({ content: value })}
        />
      </PropertySection>
      <PropertySection title="Typography">
        <FontFamilySelect
          value={props.fontFamily}
          onChange={(value) => onChange({ fontFamily: value })}
        />
        <FontWeightSelect
          value={props.fontWeight ?? '400'}
          onChange={(value) => onChange({ fontWeight: value })}
        />
        <NumberInput
          label="Font Size"
          value={props.fontSize}
          onChange={(value) => onChange({ fontSize: value })}
          min={8}
          max={72}
          unit="px"
        />
        <NumberInput
          label="Line Height"
          value={props.lineHeight}
          onChange={(value) => onChange({ lineHeight: value })}
          min={1}
          max={3}
          step={0.1}
        />
        <LetterSpacingInput
          value={props.letterSpacing ?? 0}
          onChange={(value) => onChange({ letterSpacing: value })}
        />
        <ColorPicker
          label="Text Color"
          value={props.textColor}
          onChange={(value) => onChange({ textColor: value })}
        />
        <AlignEditor
          label="Text Align"
          value={props.textAlign}
          onChange={(value) => onChange({ textAlign: value })}
        />
      </PropertySection>
      <PropertySection title="Background">
        <ColorPicker
          label="Background Color"
          value={props.backgroundColor}
          onChange={(value) => onChange({ backgroundColor: value })}
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
