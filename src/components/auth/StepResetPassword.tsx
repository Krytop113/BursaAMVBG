"use client";

import React from "react";
import { Lock, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";

interface StepResetPasswordProps {
  password: string;
  setPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (val: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string | null;
  onBack: () => void;
  verifiedUser: { username: string; email: string } | null;
}

export default function StepResetPassword({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  onSubmit,
  isLoading,
  error,
  onBack,
  verifiedUser,
}: StepResetPasswordProps) {
  return (
    <>
      <h2 className="text-xl font-bold text-white mb-2">Atur Ulang Password</h2>
      <p className="text-sm text-slate-400 mb-2">
        Mengatur ulang password untuk akun:
      </p>
      {verifiedUser && (
        <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-3 mb-6 text-sm">
          <p className="text-slate-300">
            <span className="text-slate-500 font-medium">Username:</span> {verifiedUser.username}
          </p>
          <p className="text-slate-300">
            <span className="text-slate-500 font-medium">Email:</span> {verifiedUser.email}
          </p>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            <p className="font-medium">⚠️ {error}</p>
          </div>
        )}

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-400"
          >
            Password Baru
          </label>
          <div className="relative mt-2">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock className="h-5 w-5 text-slate-500" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 py-3 pl-10 pr-12 text-sm text-white placeholder-slate-500 transition duration-200 outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-white transition duration-200"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-400"
          >
            Konfirmasi Password Baru
          </label>
          <div className="relative mt-2">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock className="h-5 w-5 text-slate-500" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 py-3 pl-10 pr-12 text-sm text-white placeholder-slate-500 transition duration-200 outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-white transition duration-200"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
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
              Mengatur Ulang...
            </>
          ) : (
            "Ubah Password"
          )}
        </button>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center text-sm text-slate-400 hover:text-white transition duration-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </button>
        </div>
      </form>
    </>
  );
}
