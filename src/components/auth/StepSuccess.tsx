"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

interface StepSuccessProps {
  loginUrl: string;
}

export default function StepSuccess({ loginUrl }: StepSuccessProps) {
  return (
    <div className="text-center py-4">
      <div className="flex justify-center mb-4">
        <CheckCircle2 className="h-16 w-16 text-teal-400 animate-bounce" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Password Berhasil Diubah</h2>
      <p className="text-sm text-slate-400 mb-6">
        Password Anda telah berhasil diperbarui. Silakan login kembali dengan password baru Anda.
      </p>
      <a
        href={loginUrl}
        className="relative flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 py-3.5 px-4 text-sm font-semibold text-white transition duration-300 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-950 shadow-lg shadow-teal-500/20"
      >
        Kembali ke Login
      </a>
    </div>
  );
}
