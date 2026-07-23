"use client";

import React, { useState } from "react";
import { X, UserPlus, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import type { Role } from "./types";

interface AddUserModalProps {
  roles: Role[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddUserModal({
  roles,
  onClose,
  onSuccess,
}: AddUserModalProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!username.trim()) {
      newErrors.username = "Username wajib diisi.";
    }

    if (!email.trim()) {
      newErrors.email = "Email wajib diisi.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Format email tidak valid.";
    }

    if (!password) {
      newErrors.password = "Password wajib diisi.";
    } else if (password.length < 6) {
      newErrors.password = "Password minimal 6 karakter.";
    }

    if (!roleId) {
      newErrors.roleId = "Role wajib dipilih.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          roleId: Number(roleId),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "Terjadi kesalahan.");
        return;
      }

      setSuccess(true);

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1200);
    } catch {
      setServerError("Gagal terhubung ke server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-slate-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500/10 rounded-lg">
              <UserPlus className="w-5 h-5 text-teal-400" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">Tambah User</h2>
              <p className="text-xs text-gray-500">Tambahkan user baru ke sistem</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {success ? (
          <div className="p-12 flex flex-col items-center gap-4">
            <CheckCircle2 className="w-12 h-12 text-teal-400 animate-bounce" />
            <p className="text-white font-semibold text-center">
              User baru berhasil ditambahkan!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {serverError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-300 mb-1.5 font-medium">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrors((prev) => ({ ...prev, username: "" }));
                }}
                placeholder="Contoh: joni_amv"
                className={`w-full px-4 py-2 bg-slate-950 rounded-lg border text-white text-sm ${
                  errors.username
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-800 focus:border-teal-500"
                } focus:outline-none transition-colors`}
              />
              {errors.username && (
                <p className="text-red-400 text-xs mt-1.5">{errors.username}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1.5 font-medium">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: "" }));
                }}
                placeholder="Contoh: user@example.com"
                className={`w-full px-4 py-2 bg-slate-950 rounded-lg border text-white text-sm ${
                  errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-800 focus:border-teal-500"
                } focus:outline-none transition-colors`}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1.5 font-medium">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: "" }));
                }}
                placeholder="Minimal 6 karakter"
                className={`w-full px-4 py-2 bg-slate-950 rounded-lg border text-white text-sm ${
                  errors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-800 focus:border-teal-500"
                } focus:outline-none transition-colors`}
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1.5">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1.5 font-medium">
                Role
              </label>
              <select
                value={roleId}
                onChange={(e) => {
                  setRoleId(e.target.value);
                  setErrors((prev) => ({ ...prev, roleId: "" }));
                }}
                className={`w-full px-4 py-2 bg-slate-950 rounded-lg border text-white text-sm appearance-none ${
                  errors.roleId
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-800 focus:border-teal-500"
                } focus:outline-none transition-colors`}
              >
                <option value="">Pilih Role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
              {errors.roleId && (
                <p className="text-red-400 text-xs mt-1.5">{errors.roleId}</p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold transition-colors"
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
                    Menyimpan...
                  </>
                ) : (
                  <>
                    Simpan
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
