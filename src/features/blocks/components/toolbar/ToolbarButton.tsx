'use client';

import { ReactNode, ButtonHTMLAttributes, forwardRef } from 'react';

interface ToolbarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  children: ReactNode;
}

export const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ isActive = false, disabled = false, className = '', children, ...props }, ref) => {
    const baseClass =
      'px-2 py-1 text-sm font-medium rounded transition-colors flex items-center justify-center min-w-[28px] h-7';
    const stateClass = disabled
      ? 'text-gray-300 cursor-not-allowed'
      : isActive
        ? 'bg-blue-500 text-white'
        : 'text-gray-700 hover:bg-gray-200';

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        className={`${baseClass} ${stateClass} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

ToolbarButton.displayName = 'ToolbarButton';

export const ToolbarDivider = () => <div className="w-px h-5 bg-gray-300 mx-1" />;
