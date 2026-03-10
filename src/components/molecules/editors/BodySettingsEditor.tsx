'use client';

import type { GlobalStyles, ContentAlignment } from '@/types/document';
import {
  PropertySection,
  TextInput,
  NumberInput,
  ColorPicker,
  FontFamilySelect,
  FontWeightSelect,
  SpacingEditor,
} from '../PropertyEditor';
import { defaultSpacing } from '@/types/defaults';

export interface BodySettingsEditorProps {
  globalStyles: GlobalStyles;
  onChange: (styles: Partial<GlobalStyles>) => void;
}

export function BodySettingsEditor({ globalStyles, onChange }: BodySettingsEditorProps) {
  return (
    <>
      <PropertySection title="General">
        <ColorPicker
          label="Text Color"
          value={globalStyles.textColor}
          onChange={(value) => onChange({ textColor: value })}
        />
        <ColorPicker
          label="Background Color"
          value={globalStyles.backgroundColor}
          onChange={(value) => onChange({ backgroundColor: value })}
        />
        <NumberInput
          label="Content Width"
          value={globalStyles.contentWidth}
          onChange={(value) => onChange({ contentWidth: value })}
          min={320}
          max={900}
          unit="px"
        />
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-600">Content Alignment</span>
          <div className="flex gap-1">
            {(['left', 'center'] as ContentAlignment[]).map((align) => (
              <button
                key={align}
                type="button"
                onClick={() => onChange({ contentAlignment: align })}
                className={`flex-1 py-2 text-sm rounded-md border capitalize ${
                  (globalStyles.contentAlignment ?? 'center') === align
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {align === 'left' ? '⬅ Left' : '⬌ Center'}
              </button>
            ))}
          </div>
        </div>
        <FontFamilySelect
          value={globalStyles.fontFamily}
          onChange={(value) => onChange({ fontFamily: value })}
        />
        <FontWeightSelect
          value={globalStyles.fontWeight ?? '400'}
          onChange={(value) => onChange({ fontWeight: value })}
        />
        <SpacingEditor
          label="Body Padding"
          value={globalStyles.padding ?? defaultSpacing}
          onChange={(value) => onChange({ padding: value })}
        />
      </PropertySection>

      <PropertySection title="Email Settings">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-600">Preheader Text</span>
          <textarea
            value={globalStyles.preheaderText ?? ''}
            onChange={(e) => onChange({ preheaderText: e.target.value })}
            className="w-full h-20 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            placeholder="Preview text shown in inbox..."
          />
          <p className="text-xs text-gray-400">
            A preheader is the short summary text that follows the subject line when viewing an email from the inbox.
          </p>
        </div>
      </PropertySection>

      <PropertySection title="Links">
        <ColorPicker
          label="Link Color"
          value={globalStyles.linkColor}
          onChange={(value) => onChange({ linkColor: value })}
        />
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm text-gray-700">Underline</span>
          <button
            type="button"
            role="switch"
            aria-checked={globalStyles.linkUnderline ?? true}
            onClick={() => onChange({ linkUnderline: !(globalStyles.linkUnderline ?? true) })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              (globalStyles.linkUnderline ?? true) ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                (globalStyles.linkUnderline ?? true) ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </label>
      </PropertySection>

      <PropertySection title="Accessibility">
        <TextInput
          label="HTML Title"
          value={globalStyles.htmlTitle ?? ''}
          onChange={(value) => onChange({ htmlTitle: value })}
          placeholder="Email title for screen readers"
        />
        <p className="text-xs text-gray-400">
          Sets the HTML &lt;title&gt; tag in the exported HTML.
        </p>
      </PropertySection>
    </>
  );
}
