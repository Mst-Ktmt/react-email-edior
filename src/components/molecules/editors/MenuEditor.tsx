'use client';

import type { MenuBlockProps, MenuItem } from '@/types';
import {
  PropertySection,
  SpacingEditor,
  AlignEditor,
  TextInput,
  NumberInput,
  ColorPicker,
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
      <PropertySection title="Typography">
        <NumberInput
          label="Font Size"
          value={props.fontSize}
          onChange={(value) => onChange({ fontSize: value })}
          min={10}
          max={24}
          unit="px"
        />
        <ColorPicker
          label="Text Color"
          value={props.textColor}
          onChange={(value) => onChange({ textColor: value })}
        />
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
      <PropertySection title="Spacing">
        <SpacingEditor
          label="Padding"
          value={props.padding}
          onChange={(value) => onChange({ padding: value })}
        />
      </PropertySection>
    </>
  );
}
