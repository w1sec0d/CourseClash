'use client';
import * as React from 'react';
import Link from 'next/link';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  href,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
}: ButtonProps) => {
  const baseClasses = `items-center justify-center px-8 py-3 text-base font-medium rounded-md inline-flex 
    transition-all duration-300 ease-in-out transform 
    hover:scale-105 hover:shadow-lg active:scale-95 active:opacity-80 
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 
    disabled:opacity-50 disabled:cursor-not-allowed 
    relative z-10`;

  const variantClasses = {
    primary: `text-white bg-emerald-600 border border-transparent 
      hover:bg-emerald-700 hover:shadow-lg active:bg-emerald-500`,
    secondary: `text-emerald-600 bg-white border border-emerald-600 
      hover:bg-emerald-50 hover:shadow-sm active:bg-emerald-100`,
  };

  const buttonClasses = clsx(
    baseClasses,
    variantClasses[variant],
    className,
    disabled && 'opacity-50 cursor-not-allowed'
  );

  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
