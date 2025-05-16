'use client';
import * as React from 'react';

interface ButtonGroupProps {
  className?: string;
  children: React.ReactNode;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({ 
  className = '',
  children 
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      {children}
    </div>
  );
};

export default ButtonGroup;
