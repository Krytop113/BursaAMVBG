"use client";

import React, { useState } from "react";
import { User, Lock, Eye, EyeOff, Loader2, KeyRound, ShieldAlert } from "lucide-react";
import { validateLogin } from "@/validators/authValidator";
import { ROUTES } from "@/routes/paths";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = validateLogin({ identifier, password });
    if (!validation.success) {
      setError(validation.error);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(ROUTES.api.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Pastikan cookie dari response disimpan oleh browser
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login gagal. Silakan coba lagi.");
      }

      await new Promise((resolve) => setTimeout(resolve, 300));
      window.location.href = ROUTES.dashboard;
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan jaringan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-teal-500 blur-[128px]"></div>
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-indigo-600 blur-[128px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.2)]">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Bursa
            <span className=" text-indigo-400 bg-clip-text">
              {" "}
              AMVBG
            </span>
          </h1>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-xl shadow-2xl">


          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="font-bold">⚠️</span>
                  </div>
                  <div className="ml-3 flex-1 md:flex md:justify-between">
                    <p className="font-medium">{error}</p>
                  </div>
                </div>
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

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-400"
                >
                  Password
                </label>
                <a href="#" className="text-xs text-teal-400 hover:underline">
                  Lupa password?
                </a>
              </div>
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

            <button
              type="submit"
              disabled={isLoading}
              className="relative flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 py-3.5 px-4 text-sm font-semibold text-white transition duration-300 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50 shadow-lg shadow-teal-500/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Masuk ke Dashboard"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
