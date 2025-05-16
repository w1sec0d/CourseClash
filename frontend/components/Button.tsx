'use client';
import * as React from 'react';
import Link from 'next/link';

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

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  href,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
}) => {
  const baseClasses = 'items-center justify-center px-8 py-3 text-base font-medium rounded-md inline-flex transition-colors duration-300';

  const variantClasses = {
    primary: 'text-white bg-emerald-600 border border-transparent hover:bg-emerald-700',
    secondary: 'text-emerald-600 bg-white border border-emerald-600 hover:bg-emerald-50',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
