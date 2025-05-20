'use client';
import * as React from 'react';
import Button from './Button';

interface PricingButtonProps {
  text: string;
  href: string;
}

export const PricingButton = ({ text, href }: PricingButtonProps) => {
  return (
    <Button href={href} variant='primary' className='text-center'>
      {text}
    </Button>
  );
};

export default PricingButton;
