'use client';

import type { HtmlBlockProps } from '@/types';
import {
  PropertySection,
  SpacingEditor,
  ResponsiveToggle,
} from '../PropertyEditor';

export interface HtmlEditorProps {
  props: HtmlBlockProps;
  onChange: (props: Partial<HtmlBlockProps>) => void;
}

export function HtmlEditor({ props, onChange }: HtmlEditorProps) {
  return (
    <>
      <PropertySection title="HTML">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-600">Custom HTML</span>
          <textarea
            value={props.htmlContent}
            onChange={(e) => onChange({ htmlContent: e.target.value })}
            className="w-full h-48 px-3 py-2 text-sm font-mono border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y bg-gray-50"
            placeholder="<p>Enter your HTML here...</p>"
            spellCheck={false}
          />
          <p className="text-xs text-gray-400">
            Enter valid HTML. Scripts will be sanitized.
          </p>
        </div>
      </PropertySection>
      <PropertySection title="General">
        <SpacingEditor
          label="Container Padding"
          value={props.padding}
          onChange={(value) => onChange({ padding: value })}
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
