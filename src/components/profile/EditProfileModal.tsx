"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { User, Mail, Lock, ShieldAlert, CheckCircle, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

interface EditProfileModalProps {
  onClose: () => void;
}

export function EditProfileModal({ onClose }: EditProfileModalProps) {
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
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: unknown) {
      const text = err instanceof Error ? err.message : "Gagal memperbarui profil.";
      setMessage({ type: "error", text });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-300 dark:border-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-teal-500 transition-colors";

  return (
    <Modal
      title="Edit Profil"
      icon={<User className="w-5 h-5" />}
      subtitle="Perbarui informasi pribadi dan kata sandi Anda"
      onClose={onClose}
      size="md"
    >
      <div className="p-6">
        {message && (
          <div
            className={`p-3.5 mb-5 rounded-xl flex items-center gap-3 border text-sm font-medium ${
              message.type === "success"
                ? "bg-teal-500/10 border-teal-500/20 text-teal-600 dark:text-teal-400"
                : "bg-red-500/10 border-red-500/20 text-red-500 dark:text-red-400"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5 shrink-0" />
            ) : (
              <ShieldAlert className="w-5 h-5 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputClass}
                placeholder="Username baru"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="nama@email.com"
            />
          </div>

          <hr className="border-slate-200 dark:border-gray-800 my-4" />

          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Ganti Kata Sandi</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Biarkan kosong jika tidak ingin diubah.</p>
          </div>

          {/* Password Baru */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Kata Sandi Baru
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="Min. 6 karakter"
            />
          </div>

          {/* Konfirmasi Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Konfirmasi Kata Sandi Baru
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
              placeholder="Ketik ulang kata sandi baru"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-sm transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>Simpan Perubahan</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
