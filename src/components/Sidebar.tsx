"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/routes/paths";
import {
  LayoutDashboard,
  Users,
  Settings,
  ShoppingBag,
  LogOut,
  FileText,
  CreditCard,
  Tags,
  BadgeCheck,
  QrCode,
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.role === 1) {
            setIsAdmin(true);
          }
        }
      } catch (err) {
        console.error("Gagal memeriksa role:", err);
      }
    };
    checkRole();
  }, []);

  const handleLogout = async () => {
    const res = await fetch(ROUTES.api.logout, {
      method: "POST",
    });

    if (res.ok) {
      window.location.href = ROUTES.login;
    }
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <aside
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72 flex-col overflow-y-hidden bg-gray-900 duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* SIDEBAR HEADER */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <Link href={ROUTES.dashboard} className="flex items-center gap-2">
          <span className="text-2xl font-bold text-white tracking-wider flex items-center gap-2">
            <ShoppingBag className="text-teal-400 w-8 h-8" />
            BursaAMVBG
          </span>
        </Link>

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
                <Link
                  href={ROUTES.dashboard}
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium duration-300 ease-in-out hover:bg-gray-800 hover:text-white ${
                    isActive(ROUTES.dashboard)
                      ? "bg-gray-800 text-teal-400"
                      : "text-gray-300"
                  }`}
                >
                  <LayoutDashboard
                    className={`w-5 h-5 group-hover:text-teal-400 ${
                      isActive(ROUTES.dashboard)
                        ? "text-teal-400"
                        : "text-gray-400"
                    }`}
                  />
                  Dashboard
                </Link>
              </li>

              <li>
                <Link
                  href={ROUTES.products}
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium duration-300 ease-in-out hover:bg-gray-800 hover:text-white ${
                    isActive(ROUTES.products)
                      ? "bg-gray-800 text-teal-400"
                      : "text-gray-300"
                  }`}
                >
                  <ShoppingBag
                    className={`w-5 h-5 group-hover:text-teal-400 ${
                      isActive(ROUTES.products)
                        ? "text-teal-400"
                        : "text-gray-400"
                    }`}
                  />
                  Produk
                </Link>
              </li>

              <li>
                <Link
                  href={ROUTES.categories}
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium duration-300 ease-in-out hover:bg-gray-800 hover:text-white ${
                    isActive(ROUTES.categories)
                      ? "bg-gray-800 text-teal-400"
                      : "text-gray-300"
                  }`}
                >
                  <Tags
                    className={`w-5 h-5 group-hover:text-teal-400 ${
                      isActive(ROUTES.categories)
                        ? "text-teal-400"
                        : "text-gray-400"
                    }`}
                  />
                  Kategori
                </Link>
              </li>

              <li>
                <Link
                  href={ROUTES.transactions}
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium duration-300 ease-in-out hover:bg-gray-800 hover:text-white ${
                    isActive(ROUTES.transactions)
                      ? "bg-gray-800 text-teal-400"
                      : "text-gray-300"
                  }`}
                >
                  <CreditCard
                    className={`w-5 h-5 group-hover:text-teal-400 ${
                      isActive(ROUTES.transactions)
                        ? "text-teal-400"
                        : "text-gray-400"
                    }`}
                  />
                  Transaksi
                </Link>
              </li>

              <li>
                <Link
                  href={ROUTES.invoice}
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium duration-300 ease-in-out hover:bg-gray-800 hover:text-white ${
                    isActive(ROUTES.invoice)
                      ? "bg-gray-800 text-teal-400"
                      : "text-gray-300"
                  }`}
                >
                  <FileText
                    className={`w-5 h-5 group-hover:text-teal-400 ${
                      isActive(ROUTES.invoice)
                        ? "text-teal-400"
                        : "text-gray-400"
                    }`}
                  />
                  Invoice
                </Link>
              </li>

              {isAdmin && (
                <>
                  <h3 className="mb-4 ml-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    ADMIN
                  </h3>

                  <li className="flex flex-col gap-1.5">
                    <Link
                      href={ROUTES.users}
                      className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium duration-300 ease-in-out hover:bg-gray-800 hover:text-white ${
                        isActive(ROUTES.users)
                          ? "bg-gray-800 text-teal-400"
                          : "text-gray-300"
                      }`}
                    >
                      <Users
                        className={`w-5 h-5 group-hover:text-teal-400 ${
                          isActive(ROUTES.users)
                            ? "text-teal-400"
                            : "text-gray-400"
                        }`}
                      />
                      Kelola Pengguna
                    </Link>
                  </li>

                  <li className="flex flex-col gap-1.5">
                    <Link
                      href={ROUTES.roles}
                      className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium duration-300 ease-in-out hover:bg-gray-800 hover:text-white ${
                        isActive(ROUTES.roles)
                          ? "bg-gray-800 text-teal-400"
                          : "text-gray-300"
                      }`}
                    >
                      <BadgeCheck
                        className={`w-5 h-5 group-hover:text-teal-400 ${
                          isActive(ROUTES.roles)
                            ? "text-teal-400"
                            : "text-gray-400"
                        }`}
                      />
                      Kelola Role
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
}
