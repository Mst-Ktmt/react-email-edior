'use client';

interface ResponsiveToggleProps {
  hideOnDesktop: boolean;
  hideOnMobile: boolean;
  onChangeDesktop: (value: boolean) => void;
  onChangeMobile: (value: boolean) => void;
}

export function ResponsiveToggle({
  hideOnDesktop,
  hideOnMobile,
  onChangeDesktop,
  onChangeMobile,
}: ResponsiveToggleProps) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs font-medium text-gray-600">Responsive Design</span>

      <label className="flex items-center justify-between cursor-pointer">
        <span className="text-sm text-gray-700">Hide on Desktop</span>
        <button
          type="button"
          role="switch"
          aria-checked={hideOnDesktop}
          onClick={() => onChangeDesktop(!hideOnDesktop)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            hideOnDesktop ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              hideOnDesktop ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </label>

      <label className="flex items-center justify-between cursor-pointer">
        <span className="text-sm text-gray-700">Hide on Mobile</span>
        <button
          type="button"
          role="switch"
          aria-checked={hideOnMobile}
          onClick={() => onChangeMobile(!hideOnMobile)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            hideOnMobile ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              hideOnMobile ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </label>
    </div>
  );
}
