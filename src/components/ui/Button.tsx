"use client";

import React from "react";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "danger" | "secondary" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  children: React.ReactNode;
}

const variantCls: Record<ButtonVariant, string> = {
  primary:
    "bg-teal-500 text-slate-950 font-semibold hover:bg-teal-400 shadow-lg shadow-teal-500/20 disabled:opacity-60",
  danger:
    "bg-red-500 text-white font-semibold hover:bg-red-400 disabled:opacity-60",
  secondary:
    "bg-slate-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-slate-200 dark:hover:bg-gray-700 disabled:opacity-50",
  ghost:
    "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-transparent hover:bg-slate-100 dark:hover:bg-gray-800 border border-transparent hover:border-slate-200 dark:hover:border-gray-700 disabled:opacity-50",
};

export function Button({
  variant = "primary",
  isLoading = false,
  loadingText,
  leftIcon,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={[
        "flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all duration-200",
        "disabled:cursor-not-allowed active:scale-[0.98]",
        variantCls[variant],
        className,
      ].join(" ")}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {loadingText ?? children}
        </>
      ) : (
        <>
          {leftIcon}
          {children}
        </>
      )}
    </button>
  );
}
