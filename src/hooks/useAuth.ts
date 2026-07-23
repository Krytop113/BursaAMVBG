"use client";

import { useQuery } from "@tanstack/react-query";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: number;
}

export function useAuth() {
  const { data: user, isLoading, refetch } = useQuery<UserProfile>({
    queryKey: ["auth-me"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      if (!res.ok) throw new Error("Unauthenticated");
      return res.json();
    },
    retry: false,
  });

  const logout = async () => {
    const res = await fetch("/api/auth/logout", { method: "POST" });
    if (res.ok) {
      window.location.href = "/login";
    }
  };

  return {
    user,
    isLoading,
    logout,
    refetch,
  };
}
