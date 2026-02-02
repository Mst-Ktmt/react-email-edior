'use client';

import type { SpacerBlockProps } from '@/types';
import {
  PropertySection,
  NumberInput,
  ResponsiveToggle,
} from '../PropertyEditor';

export interface SpacerEditorProps {
  props: SpacerBlockProps;
  onChange: (props: Partial<SpacerBlockProps>) => void;
}

export function SpacerEditor({ props, onChange }: SpacerEditorProps) {
  return (
    <>
      <PropertySection title="Size">
        <NumberInput
          label="Height"
          value={props.height}
          onChange={(value) => onChange({ height: value })}
          min={0}
          max={200}
          unit="px"
        />
        <NumberInput
          label="Mobile Height"
          value={props.mobileHeight}
          onChange={(value) => onChange({ mobileHeight: value })}
          min={0}
          max={200}
          unit="px"
        />
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
