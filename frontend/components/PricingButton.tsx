'use client';
import * as React from 'react';
import Button from './Button';

interface PricingButtonProps {
  text: string;
  href: string;
}

export const PricingButton: React.FC<PricingButtonProps> = ({ text, href }) => {
  return (
    <Button
      href={href}
      variant="primary"
      width="full"
      className="text-center"
    >
      {text}
    </Button>
  );
};

export default PricingButton;
