import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      fullWidth = false,
      leftIcon,
      rightIcon,
      className,
      id,
      ...rest
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
    
    const baseClasses = 'rounded-lg border bg-background-light focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent transition-colors';
    const errorClasses = error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300';
    const widthClass = fullWidth ? 'w-full' : '';
    const paddingClasses = `px-4 py-2 ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''}`;
    
    const inputClasses = `${baseClasses} ${errorClasses} ${widthClass} ${paddingClasses} ${className || ''}`;
    
    return (
      <div className={`flex flex-col ${widthClass}`}>
        {label && (
          <label htmlFor={inputId} className="mb-1 text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              {leftIcon}
            </div>
          )}
          
          <input
            id={inputId}
            className={inputClasses}
            ref={ref}
            {...(error ? { "aria-invalid": "true" } : {})}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...rest}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <div id={`${inputId}-error`} className="mt-1 text-sm text-red-600">
            {error}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input'; 