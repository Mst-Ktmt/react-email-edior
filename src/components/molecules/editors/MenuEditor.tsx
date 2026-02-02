'use client';

import type { MenuBlockProps, MenuItem, LinkTarget } from '@/types';
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

export interface MenuEditorProps {
  props: MenuBlockProps;
  onChange: (props: Partial<MenuBlockProps>) => void;
}

export function MenuEditor({ props, onChange }: MenuEditorProps) {
  const handleItemChange = (index: number, updates: Partial<MenuItem>) => {
    const newItems = [...props.items];
    newItems[index] = { ...newItems[index], ...updates };
    onChange({ items: newItems });
  };

  const handleAddItem = () => {
    onChange({
      items: [...props.items, { label: 'New Item', url: '#' }],
    });
  };

  const handleRemoveItem = (index: number) => {
    const newItems = props.items.filter((_, i) => i !== index);
    onChange({ items: newItems });
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= props.items.length) return;

    const newItems = [...props.items];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    onChange({ items: newItems });
  };

  return (
    <>
      <PropertySection title="Menu Items">
        <div className="flex flex-col gap-2">
          {props.items.map((item, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">
                  Item {index + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMoveItem(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveItem(index, 'down')}
                    disabled={index === props.items.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <TextInput
                  label="Label"
                  value={item.label}
                  onChange={(value) => handleItemChange(index, { label: value })}
                />
                <TextInput
                  label="URL"
                  value={item.url}
                  onChange={(value) => handleItemChange(index, { url: value })}
                />
                <LinkTargetSelect
                  value={item.target ?? '_self'}
                  onChange={(value) => handleItemChange(index, { target: value as LinkTarget })}
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddItem}
            className="w-full py-2 text-sm text-blue-600 border border-dashed border-blue-300 rounded-md hover:bg-blue-50"
          >
            + Add Menu Item
          </button>
        </div>
      </PropertySection>
      <PropertySection title="Styles">
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
          min={10}
          max={24}
          unit="px"
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
        <ColorPicker
          label="Link Color"
          value={props.linkColor ?? props.textColor}
          onChange={(value) => onChange({ linkColor: value })}
        />
      </PropertySection>
      <PropertySection title="Layout">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-600">Layout</span>
          <div className="flex gap-1">
            {(['horizontal', 'vertical'] as const).map((layout) => (
              <button
                key={layout}
                type="button"
                onClick={() => onChange({ layout })}
                className={`flex-1 py-2 text-sm rounded-md border capitalize ${
                  (props.layout ?? 'horizontal') === layout
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {layout}
              </button>
            ))}
          </div>
        </div>
        <TextInput
          label="Separator"
          value={props.separator}
          onChange={(value) => onChange({ separator: value })}
        />
        <AlignEditor
          label="Alignment"
          value={props.align}
          onChange={(value) => onChange({ align: value })}
        />
      </PropertySection>
      <PropertySection title="General">
        <SpacingEditor
          label="Padding"
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
