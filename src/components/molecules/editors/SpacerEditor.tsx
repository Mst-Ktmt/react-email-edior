'use client';

import type { SpacerBlockProps } from '@/types';
import { PropertySection, NumberInput } from '../PropertyEditor';

export interface SpacerEditorProps {
  props: SpacerBlockProps;
  onChange: (props: Partial<SpacerBlockProps>) => void;
}

export function SpacerEditor({ props, onChange }: SpacerEditorProps) {
  return (
    <>
      <PropertySection title="Spacer">
        <NumberInput
          label="Height"
          value={props.height}
          onChange={(value) => onChange({ height: value })}
          min={0}
          max={200}
          unit="px"
        />
      </PropertySection>
      <PropertySection title="Spacing">
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
