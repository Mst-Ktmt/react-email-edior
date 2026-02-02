'use client';

import type { ImageBlockProps } from '@/types';
import {
  PropertySection,
  SpacingEditor,
  AlignEditor,
  TextInput,
  NumberInput,
  LinkTargetSelect,
  ResponsiveToggle,
} from '../PropertyEditor';

export interface ImageEditorProps {
  props: ImageBlockProps;
  onChange: (props: Partial<ImageBlockProps>) => void;
}

export function ImageEditor({ props, onChange }: ImageEditorProps) {
  return (
    <>
      <PropertySection title="Image">
        <TextInput
          label="Image URL"
          value={props.src}
          onChange={(value) => onChange({ src: value })}
          placeholder="https://..."
        />
        <TextInput
          label="Alt Text"
          value={props.alt}
          onChange={(value) => onChange({ alt: value })}
          placeholder="Image description"
        />
        <NumberInput
          label="Width"
          value={typeof props.width === 'number' ? props.width : 100}
          onChange={(value) => onChange({ width: value })}
          min={0}
          max={600}
          unit="px"
        />
        <AlignEditor
          label="Alignment"
          value={props.align}
          onChange={(value) => onChange({ align: value })}
        />
      </PropertySection>
      <PropertySection title="Action">
        <TextInput
          label="Link URL"
          value={props.linkUrl ?? ''}
          onChange={(value) => onChange({ linkUrl: value || '' })}
          placeholder="https://..."
        />
        {props.linkUrl && (
          <LinkTargetSelect
            value={props.linkTarget ?? '_blank'}
            onChange={(value) => onChange({ linkTarget: value as '_self' | '_blank' })}
          />
        )}
      </PropertySection>
      <PropertySection title="Style">
        <NumberInput
          label="Border Radius"
          value={props.borderRadius}
          onChange={(value) => onChange({ borderRadius: value })}
          min={0}
          max={100}
          unit="px"
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
