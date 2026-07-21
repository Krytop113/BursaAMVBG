"use client";

import React, { useState } from "react";
import { KeyRound } from "lucide-react";
import { ROUTES } from "@/routes/paths";

// Import subcomponents
import StepVerifyUser from "@/components/auth/StepVerifyUser";
import StepVerifyPin from "@/components/auth/StepVerifyPin";
import StepResetPassword from "@/components/auth/StepResetPassword";
import StepSuccess from "@/components/auth/StepSuccess";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: Verify user, 2: Verify PIN, 3: Reset password, 4: Success
  const [identifier, setIdentifier] = useState("");
  const [pin, setPin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState<{ username: string; email: string } | null>(null);

  const handleVerifyUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError("Email atau Username tidak boleh kosong!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(ROUTES.api.forgotPassword, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "verify-user", identifier }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal memverifikasi user.");
      }

      setVerifiedUser(data.user);
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan jaringan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (pin.length !== 6) {
      setError("PIN keamanan harus 6 digit angka!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(ROUTES.api.forgotPassword, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "verify-pin", identifier, pin }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "PIN keamanan salah.");
      }

      setStep(3);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan jaringan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password minimal harus 6 karakter!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(ROUTES.api.forgotPassword, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "reset", identifier, pin, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal mengatur ulang password.");
      }

      setStep(4);
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
          {step === 1 && (
            <StepVerifyUser
              identifier={identifier}
              setIdentifier={setIdentifier}
              onSubmit={handleVerifyUser}
              isLoading={isLoading}
              error={error}
              backToLoginUrl={ROUTES.login}
            />
          )}

          {step === 2 && (
            <StepVerifyPin
              pin={pin}
              setPin={setPin}
              onSubmit={handleVerifyPin}
              isLoading={isLoading}
              error={error}
              onBack={() => setStep(1)}
              verifiedUser={verifiedUser}
            />
          )}

          {step === 3 && (
            <StepResetPassword
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              showConfirmPassword={showConfirmPassword}
              setShowConfirmPassword={setShowConfirmPassword}
              onSubmit={handleReset}
              isLoading={isLoading}
              error={error}
              onBack={() => setStep(2)}
              verifiedUser={verifiedUser}
            />
          )}

          {step === 4 && (
            <StepSuccess loginUrl={ROUTES.login} />
          )}
        </div>
      </div>
    </div>
  );
}
