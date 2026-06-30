"use client";

import React from "react";
import {
  LayoutDashboard,
  Users,
  Settings,
  ShoppingBag,
  BarChart3,
  LogOut,
  FileText,
  CreditCard,
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (res.ok) {
      window.location.href = "/login";
    }
  };

  return (
    <aside
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72 flex-col overflow-y-hidden bg-gray-900 duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* SIDEBAR HEADER */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <a href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-white tracking-wider flex items-center gap-2">
            <ShoppingBag className="text-teal-400 w-8 h-8" />
            BursaAMVBG
          </span>
        </a>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          className="block lg:hidden text-gray-400 hover:text-white"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.32498 17.6 8.54998 17.6875 8.77498 17.6875C8.99998 17.6875 9.22498 17.6 9.38748 17.4375C9.72498 17.1 9.72498 16.575 9.38748 16.2375L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* SIDEBAR HEADER */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* Navigation Group */}
        <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              <li>
                <a
                  href="#"
                  className="group relative flex items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium text-gray-300 duration-300 ease-in-out hover:bg-gray-800 hover:text-white"
                >
                  <LayoutDashboard className="w-5 h-5 group-hover:text-teal-400" />
                  Dashboard
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="group relative flex items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium text-gray-300 duration-300 ease-in-out hover:bg-gray-800 hover:text-white"
                >
                  <ShoppingBag className="w-5 h-5 group-hover:text-teal-400" />
                  Produk
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="group relative flex items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium text-gray-300 duration-300 ease-in-out hover:bg-gray-800 hover:text-white"
                >
                  <Users className="w-5 h-5 group-hover:text-teal-400" />
                  Pelanggan
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="group relative flex items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium text-gray-300 duration-300 ease-in-out hover:bg-gray-800 hover:text-white"
                >
                  <CreditCard className="w-5 h-5 group-hover:text-teal-400" />
                  Transaksi
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="group relative flex items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium text-gray-300 duration-300 ease-in-out hover:bg-gray-800 hover:text-white"
                >
                  <BarChart3 className="w-5 h-5 group-hover:text-teal-400" />
                  Laporan
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="group relative flex items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium text-gray-300 duration-300 ease-in-out hover:bg-gray-800 hover:text-white"
                >
                  <FileText className="w-5 h-5 group-hover:text-teal-400" />
                  Invoice
                </a>
              </li>
            </ul>
          </div>

          {/* OTHERS GROUP */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
              PENGATURAN
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              <li>
                <a
                  href="#"
                  className="group relative flex items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium text-gray-300 duration-300 ease-in-out hover:bg-gray-800 hover:text-white"
                >
                  <Settings className="w-5 h-5 group-hover:text-teal-400" />
                  Pengaturan Toko
                </a>
              </li>

              <li>
                <button
                  onClick={handleLogout}
                  className="w-full group relative flex items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium text-red-400 duration-300 ease-in-out hover:bg-red-950/30 hover:text-red-300"
                >
                  <LogOut className="w-5 h-5" />
                  Keluar
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
}
