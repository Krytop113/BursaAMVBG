'use client';

import React from 'react';
import { Bell, Search, Menu, User, ChevronDown } from 'lucide-react';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  return (
    <header className="sticky top-0 z-999 flex w-full bg-slate-900 border-b border-gray-800 drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        
        {/* Toggle Button for Mobile */}
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden text-gray-800"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="hidden sm:block">
          <form action="#" method="POST">
            <div className="relative">
              <button className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                <Search className="w-5 h-5" />
              </button>
              <input
                type="text"
                placeholder="Cari sesuatu..."
                className="w-full bg-transparent pl-9 pr-4 font-medium text-white focus:outline-none xl:w-125 placeholder:text-gray-500 text-sm"
              />
            </div>
          </form>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3 2x1:gap-7 ml-auto">
          {/* Notifications */}
          <button className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border border-gray-800 bg-gray-800/50 hover:bg-gray-800 text-gray-300 hover:text-white">
            <span className="absolute -top-0.5 -right-0.5 z-1 h-2 w-2 rounded-full bg-red-500"></span>
            <Bell className="w-4 h-4" />
          </button>

          {/* User Profile */}
          <div className="relative flex items-center gap-3">
            <span className="hidden text-right lg:block">
              <span className="block text-sm font-semibold text-white">Administrator</span>
              <span className="block text-xs text-gray-400">Super Admin</span>
            </span>

            <span className="h-10 w-10 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <User className="w-5 h-5" />
            </span>

            <ChevronDown className="hidden sm:block text-gray-400 w-4 h-4 cursor-pointer" />
          </div>
        </div>

      </div>
    </header>
  );
}
