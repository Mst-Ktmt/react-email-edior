'use client';

import type { HeadingBlockProps, HeadingLevel } from '@/types';
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

export interface HeadingEditorProps {
  props: HeadingBlockProps;
  onChange: (props: Partial<HeadingBlockProps>) => void;
}

const HEADING_LEVELS: { value: HeadingLevel; label: string }[] = [
  { value: 1, label: 'H1' },
  { value: 2, label: 'H2' },
  { value: 3, label: 'H3' },
  { value: 4, label: 'H4' },
  { value: 5, label: 'H5' },
  { value: 6, label: 'H6' },
];

export function HeadingEditor({ props, onChange }: HeadingEditorProps) {
  return (
    <>
      <PropertySection title="Content">
        <TextInput
          label="Heading Text"
          value={props.content}
          onChange={(value) => onChange({ content: value })}
        />
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-600">Heading Level</span>
          <div className="flex gap-1">
            {HEADING_LEVELS.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => onChange({ level: level.value })}
                className={`flex-1 py-2 text-sm rounded-md border ${
                  props.level === level.value
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>
      </PropertySection>
      <PropertySection title="Typography">
        <FontFamilySelect
          value={props.fontFamily}
          onChange={(value) => onChange({ fontFamily: value })}
        />
        <FontWeightSelect
          value={props.fontWeight ?? '700'}
          onChange={(value) => onChange({ fontWeight: value })}
        />
        <NumberInput
          label="Font Size"
          value={props.fontSize}
          onChange={(value) => onChange({ fontSize: value })}
          min={12}
          max={72}
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
          value={props.backgroundColor ?? 'transparent'}
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
