'use client';

import type { ImageBlockProps } from '@/types';
import {
  PropertySection,
  SpacingEditor,
  AlignEditor,
  TextInput,
  NumberInput,
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
      </PropertySection>
      <PropertySection title="Link">
        <TextInput
          label="Link URL"
          value={props.linkUrl ?? ''}
          onChange={(value) => onChange({ linkUrl: value || '' })}
          placeholder="https://..."
        />
      </PropertySection>
      <PropertySection title="Style">
        <AlignEditor
          label="Alignment"
          value={props.align}
          onChange={(value) => onChange({ align: value })}
        />
        <NumberInput
          label="Border Radius"
          value={props.borderRadius}
          onChange={(value) => onChange({ borderRadius: value })}
          min={0}
          max={100}
          unit="px"
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
