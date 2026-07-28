"use client";

import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  title: string;
  icon: React.ReactNode;
  subtitle?: string;
  size?: "sm" | "md" | "lg";
  onClose: () => void;
  children: React.ReactNode;
  accent?: "teal" | "red";
}

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

const accentMap = {
  teal: {
    iconBg: "bg-teal-500/10 border-teal-500/20",
    iconText: "text-teal-400",
  },
  red: {
    iconBg: "bg-red-500/10 border-red-500/20",
    iconText: "text-red-400",
  },
};


export function Modal({
  title,
  icon,
  subtitle,
  size = "md",
  onClose,
  children,
  accent = "teal",
}: ModalProps) {
  const { iconBg, iconText } = accentMap[accent];

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`relative w-full ${sizeMap[size]} bg-white dark:bg-slate-900 border border-slate-200 dark:border-gray-800 rounded-2xl shadow-2xl shadow-black/20 dark:shadow-black/50 overflow-hidden`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className={`p-2 ${iconBg} rounded-lg border`}>
              <span className={iconText}>{icon}</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
              {subtitle && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup modal"
            className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        {children}
      </div>
    </div>
  );
}
