import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'swiss';
type ButtonSize = 'sm' | 'md' | 'lg';

// Combine HTML button props with motion button props
export interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  className,
  whileTap = { scale: 0.98 },
  whileHover = { scale: 1.02 },
  ...rest
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500',
    swiss: 'bg-primary hover:bg-primary border-0 text-white font-swiss font-normal tracking-tight focus:ring-0 focus:ring-offset-0 uppercase',
  };
  
  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };
  
  // Modify the base classes based on variant
  const getBaseClasses = () => {
    if (variant === 'swiss') {
      return 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none';
    }
    return baseClasses;
  };
  
  const disabledClasses = disabled || isLoading ? 'opacity-50 cursor-not-allowed' : '';
  const widthClass = fullWidth ? 'w-full' : '';
  
  const buttonClasses = `${getBaseClasses()} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${widthClass} ${className || ''}`;
  
  // Define the motion animations based on variant
  const motionTap = variant === 'swiss' ? { scale: 0.95 } : whileTap;
  const motionHover = variant === 'swiss' ? { y: -2 } : whileHover;
  
  return (
    <motion.button
      className={buttonClasses}
      disabled={disabled || isLoading}
      whileTap={motionTap}
      whileHover={motionHover}
      {...rest}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon as React.ReactNode}</span>}
      <span>{children as React.ReactNode}</span>
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon as React.ReactNode}</span>}
    </motion.button>
  );
}; 