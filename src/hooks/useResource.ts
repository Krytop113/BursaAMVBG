"use client";

import { useQuery, UseQueryResult } from "@tanstack/react-query";

export function createResourceHook<T>(
  queryKey: string,
  url: string,
  errorMessage: string = "Gagal mengambil data"
) {
  return function useResource(): UseQueryResult<T, Error> {
    return useQuery<T, Error>({
      queryKey: [queryKey],
      queryFn: async () => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(errorMessage);
        return res.json();
      },
    });
  };
}
