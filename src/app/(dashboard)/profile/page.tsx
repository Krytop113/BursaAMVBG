"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { User, Mail, Lock, ShieldAlert, CheckCircle } from "lucide-react";
import { Button, inputCls } from "@/components/ui";

export default function ProfilePage() {
  const { user, refetch } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (password && password !== confirmPassword) {
      setMessage({ type: "error", text: "Konfirmasi password baru tidak cocok!" });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          ...(password ? { password } : {}),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal memperbarui profil.");
      }

      setMessage({ type: "success", text: "Profil Anda berhasil diperbarui!" });
      setPassword("");
      setConfirmPassword("");
      refetch();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white md:text-3xl">Pengaturan Profil</h1>
        <p className="text-gray-400 text-sm mt-1">
          Perbarui informasi pribadi dan keamanan kata sandi Anda.
        </p>
      </div>

      <div className="bg-slate-900 border border-gray-800 rounded-xl p-6 shadow-lg">
        {message && (
          <div
            className={`p-4 mb-6 rounded-lg flex items-start gap-3 border ${
              message.type === "success"
                ? "bg-teal-500/10 border-teal-500/20 text-teal-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5 shrink-0" />
            ) : (
              <ShieldAlert className="w-5 h-5 shrink-0" />
            )}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" /> Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputCls(false)}
              placeholder="Username baru"
            />
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" /> Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls(false)}
              placeholder="nama@email.com"
            />
          </div>

          <hr className="border-gray-800 my-6" />

          <div className="space-y-1">
            <h3 className="text-md font-semibold text-white">Ganti Kata Sandi</h3>
            <p className="text-xs text-gray-500">Biarkan kosong jika tidak ingin mengubah kata sandi.</p>
          </div>

          {/* New Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Lock className="w-4 h-4 text-gray-500" /> Kata Sandi Baru
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls(false)}
              placeholder="Min. 6 karakter"
            />
          </div>

          {/* Confirm New Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Lock className="w-4 h-4 text-gray-500" /> Konfirmasi Kata Sandi Baru
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputCls(false)}
              placeholder="Ketik ulang kata sandi baru"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            isLoading={isSubmitting}
            variant="primary"
            className="w-full sm:w-auto font-semibold cursor-pointer"
          >
            Simpan Perubahan
          </Button>
        </form>
      </div>
    </div>
  );
}
