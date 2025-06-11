'use client';

import React from 'react';

interface CourseNavbarProps {
  toggleSidebar: () => void;
}

const CourseNavbar: React.FC<CourseNavbarProps> = ({ toggleSidebar }) => {
  return (
    <nav className="bg-emerald-700 text-white shadow-md w-full p-4 fixed top-0 z-50">
      <div className="mx-auto justify-between items-center container flex">
        <div className="items-center flex space-x-2">
          <button
            type="button"
            className="p-2 rounded hover:bg-emerald-600 transition lg:hidden"
            id="sidebarToggle"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
          <div className="items-center flex space-x-3">
            {/* <img alt="Logo de Course Clash - Una espada insertada en un birrete de graduación" src="https://placehold.co/50x50/emerald/white?text=CC" className="h-10 w-10 rounded-full"> */}
            <p className="text-xl font-bold">Course Clash</p>
          </div>
        </div>
        <div className="items-center flex space-x-4">
          <div className="items-center bg-emerald-600 rounded-full px-3 py-1 flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span className="font-medium">500 Monedas</span>
          </div>
          <div className="relative">
            <button
              type="button"
              className="relative p-1 hover:bg-emerald-600 transition rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                ></path>
              </svg>
              <span className="bg-red-500 text-white rounded-full w-4 h-4 items-center justify-center text-xs absolute top-0 right-0 flex">
                3
              </span>
            </button>
          </div>
          {/* <img alt="Foto de perfil del estudiante" src="https://placehold.co/40x40/emerald/white?text=MR" className="border-2
            border-white h-8 w-8 rounded-full"> */}
        </div>
      </div>
    </nav>
  );
};

export default CourseNavbar;
