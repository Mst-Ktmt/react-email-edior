'use client';

import type { ButtonBlockProps, ButtonHoverStyle } from '@/types';
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
import { CheckboxInput, BoxShadowEditor, IconEditor, GradientEditor } from '@/components/atoms';

export interface ButtonEditorProps {
  props: ButtonBlockProps;
  onChange: (props: Partial<ButtonBlockProps>) => void;
}

/**
 * 色を暗くするユーティリティ関数
 * @param color - 元の色（hex形式）
 * @param percent - 暗くする割合（0-100）
 * @returns 暗くした色（hex形式）
 */
function darkenColor(color: string, percent: number): string {
  // hex形式の色を解析
  const hex = color.replace('#', '');
  const r = Number.parseInt(hex.substring(0, 2), 16);
  const g = Number.parseInt(hex.substring(2, 4), 16);
  const b = Number.parseInt(hex.substring(4, 6), 16);

  // 暗くする
  const factor = 1 - percent / 100;
  const newR = Math.round(r * factor);
  const newG = Math.round(g * factor);
  const newB = Math.round(b * factor);

  // hex形式に戻す
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
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
      <PropertySection title="Tracking Parameters">
        <CheckboxInput
          label="Enable Tracking"
          checked={!!props.tracking}
          onChange={(checked: boolean) => {
            if (checked) {
              onChange({
                tracking: {
                  utmSource: 'email',
                  utmMedium: 'newsletter',
                },
              });
            } else {
              onChange({ tracking: undefined });
            }
          }}
        />
        {props.tracking && (
          <>
            <TextInput
              label="UTM Source"
              value={props.tracking.utmSource ?? ''}
              onChange={(value) =>
                onChange({
                  tracking: { ...props.tracking, utmSource: value || undefined },
                })
              }
              placeholder="email"
            />
            <TextInput
              label="UTM Medium"
              value={props.tracking.utmMedium ?? ''}
              onChange={(value) =>
                onChange({
                  tracking: { ...props.tracking, utmMedium: value || undefined },
                })
              }
              placeholder="newsletter"
            />
            <TextInput
              label="UTM Campaign"
              value={props.tracking.utmCampaign ?? ''}
              onChange={(value) =>
                onChange({
                  tracking: { ...props.tracking, utmCampaign: value || undefined },
                })
              }
              placeholder="spring_sale"
            />
            <TextInput
              label="UTM Term"
              value={props.tracking.utmTerm ?? ''}
              onChange={(value) =>
                onChange({
                  tracking: { ...props.tracking, utmTerm: value || undefined },
                })
              }
              placeholder="running+shoes"
            />
            <TextInput
              label="UTM Content"
              value={props.tracking.utmContent ?? ''}
              onChange={(value) =>
                onChange({
                  tracking: { ...props.tracking, utmContent: value || undefined },
                })
              }
              placeholder="logolink"
            />
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-700">Custom Parameters</label>
              {props.tracking.customParams &&
                Object.entries(props.tracking.customParams).map(([key, value], index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={key}
                      onChange={(e) => {
                        const newCustomParams = { ...props.tracking?.customParams };
                        delete newCustomParams[key];
                        if (e.target.value) {
                          newCustomParams[e.target.value] = value;
                        }
                        onChange({
                          tracking: { ...props.tracking, customParams: newCustomParams },
                        });
                      }}
                      placeholder="key"
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => {
                        const newCustomParams = { ...props.tracking?.customParams };
                        newCustomParams[key] = e.target.value;
                        onChange({
                          tracking: { ...props.tracking, customParams: newCustomParams },
                        });
                      }}
                      placeholder="value"
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newCustomParams = { ...props.tracking?.customParams };
                        delete newCustomParams[key];
                        onChange({
                          tracking: { ...props.tracking, customParams: newCustomParams },
                        });
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                      title="Remove parameter"
                    >
                      ×
                    </button>
                  </div>
                ))}
              <button
                type="button"
                onClick={() => {
                  const newCustomParams = { ...(props.tracking?.customParams || {}), '': '' };
                  onChange({
                    tracking: { ...props.tracking, customParams: newCustomParams },
                  });
                }}
                className="w-full px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                + Add Custom Parameter
              </button>
            </div>
          </>
        )}
      </PropertySection>
      <PropertySection title="Button Options">
        {/* Background Type */}
        <div>
          <label className="text-xs font-medium text-gray-700 mb-2 block">
            Background Type
          </label>
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => onChange({ backgroundGradient: undefined })}
              className={`
                flex-1 px-3 py-2 text-sm font-medium border rounded focus:outline-none focus:ring-2 focus:ring-blue-500
                ${!props.backgroundGradient ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}
              `}
            >
              Solid
            </button>
            <button
              type="button"
              onClick={() => {
                if (!props.backgroundGradient) {
                  onChange({
                    backgroundGradient: {
                      type: 'linear',
                      angle: 90,
                      colors: [
                        { color: props.backgroundColor, position: 0 },
                        { color: darkenColor(props.backgroundColor, 20), position: 100 },
                      ],
                    },
                  });
                }
              }}
              className={`
                flex-1 px-3 py-2 text-sm font-medium border rounded focus:outline-none focus:ring-2 focus:ring-blue-500
                ${props.backgroundGradient ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}
              `}
            >
              Gradient
            </button>
          </div>
        </div>

        {/* Solid Background Color */}
        {!props.backgroundGradient && (
          <ColorPicker
            label="Background Color"
            value={props.backgroundColor}
            onChange={(value) => onChange({ backgroundColor: value })}
          />
        )}

        {/* Gradient Editor */}
        {props.backgroundGradient && (
          <GradientEditor
            value={props.backgroundGradient}
            onChange={(value) => onChange({ backgroundGradient: value })}
          />
        )}

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
        <NumberInput
          label="Opacity"
          value={props.opacity ?? 1.0}
          onChange={(value) => onChange({ opacity: value })}
          min={0}
          max={1}
          step={0.1}
        />

        {/* Width Constraints */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Width Constraints</label>
          <NumberInput
            label="Min Width"
            value={props.minWidth ?? 0}
            onChange={(value) => onChange({ minWidth: value > 0 ? value : undefined })}
            min={0}
            max={1000}
            unit="px"
          />
          <NumberInput
            label="Max Width"
            value={props.maxWidth ?? 0}
            onChange={(value) => onChange({ maxWidth: value > 0 ? value : undefined })}
            min={0}
            max={1000}
            unit="px"
          />
        </div>
      </PropertySection>

      <PropertySection title="Hover Style">
        <CheckboxInput
          label="Enable Hover Effect"
          checked={!!props.hoverStyle}
          onChange={(checked: boolean) => {
            if (checked) {
              // ホバー効果を有効化（背景色を10%暗くしたデフォルト値）
              const hoverStyle: ButtonHoverStyle = {
                backgroundColor: darkenColor(props.backgroundColor, 10),
                borderColor: props.borderColor ? darkenColor(props.borderColor, 10) : undefined,
              };
              onChange({ hoverStyle });
            } else {
              // ホバー効果を無効化
              onChange({ hoverStyle: undefined });
            }
          }}
        />
        {props.hoverStyle && (
          <>
            <ColorPicker
              label="Hover Background Color"
              value={props.hoverStyle.backgroundColor ?? props.backgroundColor}
              onChange={(value) =>
                onChange({
                  hoverStyle: { ...props.hoverStyle, backgroundColor: value },
                })
              }
            />
            <ColorPicker
              label="Hover Text Color"
              value={props.hoverStyle.textColor ?? props.textColor}
              onChange={(value) =>
                onChange({
                  hoverStyle: { ...props.hoverStyle, textColor: value },
                })
              }
            />
            {(props.borderWidth ?? 0) > 0 && (
              <ColorPicker
                label="Hover Border Color"
                value={props.hoverStyle.borderColor ?? props.borderColor ?? '#000000'}
                onChange={(value) =>
                  onChange({
                    hoverStyle: { ...props.hoverStyle, borderColor: value },
                  })
                }
              />
            )}
            <NumberInput
              label="Hover Opacity"
              value={props.hoverStyle.opacity ?? 1.0}
              onChange={(value) =>
                onChange({
                  hoverStyle: { ...props.hoverStyle, opacity: value },
                })
              }
              min={0}
              max={1}
              step={0.1}
            />
          </>
        )}
      </PropertySection>

      <PropertySection title="Box Shadow">
        <BoxShadowEditor
          value={props.boxShadow}
          onChange={(value) => onChange({ boxShadow: value })}
        />
      </PropertySection>

      <PropertySection title="Icon">
        <IconEditor
          value={props.icon}
          onChange={(value) => onChange({ icon: value })}
          defaultTextColor={props.textColor}
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
