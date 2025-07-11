import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  icon?: React.ReactNode; // Alias for leftIcon
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helpText,
  variant = 'default',
  size = 'md',
  leftIcon,
  rightIcon,
  icon,
  fullWidth = false,
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'block border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500';
  
  const variants = {
    default: 'border-gray-300 focus:border-blue-500',
    filled: 'border-gray-300 bg-gray-50 focus:bg-white focus:border-blue-500',
    outlined: 'border-2 border-gray-300 focus:border-blue-500'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const errorClasses = error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : '';
  const disabledClasses = props.disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : '';
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Use icon prop as alias for leftIcon
  const actualLeftIcon = leftIcon || icon;

  const inputClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${errorClasses}
    ${disabledClasses}
    ${widthClasses}
    ${actualLeftIcon ? 'pl-10' : ''}
    ${rightIcon ? 'pr-10' : ''}
    ${className}
  `.trim();

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {actualLeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">
              {actualLeftIcon}
            </span>
          </div>
        )}
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">
              {rightIcon}
            </span>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input'; 