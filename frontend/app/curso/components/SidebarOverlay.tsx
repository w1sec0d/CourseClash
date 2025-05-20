'use client';

import React from 'react';

interface SidebarOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SidebarOverlay: React.FC<SidebarOverlayProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`bg-black lg:hidden fixed inset-0 bg-opacity-50 z-30 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      id="sidebarOverlay"
      onClick={onClose}
      aria-hidden={!isOpen}
    ></div>
  );
};

export default SidebarOverlay;
