'use client';

import type { ButtonBlockProps } from '@/types';
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
  LinkTargetSelect,
  ResponsiveToggle,
} from '../PropertyEditor';

export interface ButtonEditorProps {
  props: ButtonBlockProps;
  onChange: (props: Partial<ButtonBlockProps>) => void;
}

export function ButtonEditor({ props, onChange }: ButtonEditorProps) {
  return (
    <>
      <PropertySection title="Action">
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
        <LinkTargetSelect
          value={props.linkTarget ?? '_blank'}
          onChange={(value) => onChange({ linkTarget: value as '_self' | '_blank' })}
        />
      </PropertySection>
      <PropertySection title="Button Options">
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
          max={48}
          unit="px"
        />
        <NumberInput
          label="Line Height"
          value={props.lineHeight ?? 1.2}
          onChange={(value) => onChange({ lineHeight: value })}
          min={1}
          max={3}
          step={0.1}
        />
        <LetterSpacingInput
          value={props.letterSpacing ?? 0}
          onChange={(value) => onChange({ letterSpacing: value })}
        />
      </PropertySection>
      <PropertySection title="Spacing">
        <AlignEditor
          label="Alignment"
          value={props.align}
          onChange={(value) => onChange({ align: value })}
        />
        <SpacingEditor
          label="Padding"
          value={props.padding}
          onChange={(value) => onChange({ padding: value })}
        />
      </PropertySection>
      <PropertySection title="Border">
        <NumberInput
          label="Border Radius"
          value={props.borderRadius}
          onChange={(value) => onChange({ borderRadius: value })}
          min={0}
          max={50}
          unit="px"
        />
        <NumberInput
          label="Border Width"
          value={props.borderWidth ?? 0}
          onChange={(value) => onChange({ borderWidth: value })}
          min={0}
          max={10}
          unit="px"
        />
        {(props.borderWidth ?? 0) > 0 && (
          <ColorPicker
            label="Border Color"
            value={props.borderColor ?? '#000000'}
            onChange={(value) => onChange({ borderColor: value })}
          />
        )}
      </PropertySection>
      <PropertySection title="General">
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
