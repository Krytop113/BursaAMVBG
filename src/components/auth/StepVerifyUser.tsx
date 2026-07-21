"use client";

import React from "react";
import { User, Loader2, ArrowLeft } from "lucide-react";

interface StepVerifyUserProps {
  identifier: string;
  setIdentifier: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string | null;
  backToLoginUrl: string;
}

export default function StepVerifyUser({
  identifier,
  setIdentifier,
  onSubmit,
  isLoading,
  error,
  backToLoginUrl,
}: StepVerifyUserProps) {
  return (
    <>
      <h2 className="text-xl font-bold text-white mb-2">Lupa Password?</h2>
      <p className="text-sm text-slate-400 mb-6">
        Masukkan email atau username Anda untuk memverifikasi akun Anda.
      </p>

      <form onSubmit={onSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            <p className="font-medium">⚠️ {error}</p>
          </div>
        )}

        <div>
          <label
            htmlFor="identifier"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-400"
          >
            Email atau Username
          </label>
          <div className="relative mt-2">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <User className="h-5 w-5 text-slate-500" />
            </div>
            <input
              id="identifier"
              name="identifier"
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 transition duration-200 outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50"
              placeholder="Username atau email"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="relative flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 py-3.5 px-4 text-sm font-semibold text-white transition duration-300 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50 shadow-lg shadow-teal-500/20"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Memverifikasi...
            </>
          ) : (
            "Lanjutkan"
          )}
        </button>

        <div className="text-center mt-4">
          <a
            href={backToLoginUrl}
            className="inline-flex items-center text-sm text-slate-400 hover:text-white transition duration-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Login
          </a>
        </div>
      </form>
    </>
  );
}
