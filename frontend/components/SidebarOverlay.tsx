'use client';

import React from 'react';

const SidebarOverlay: React.FC = () => {
  return (
    <div
      className="bg-black lg:hidden fixed inset-0 bg-opacity-50 z-30 transition-opacity duration-300 opacity-100"
      id="sidebarOverlay"

      aria-hidden={false}
    ></div>
  );
};

export default SidebarOverlay;
