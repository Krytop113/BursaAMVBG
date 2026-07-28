"use client";

import { Search } from "lucide-react";
import type { Role } from "./types";

interface UserFiltersProps {
  roles: Role[];
  searchQuery: string;
  selectedRole: string;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: string) => void;
}

export default function UserFilters({
  roles,
  searchQuery,
  selectedRole,
  onSearchChange,
  onRoleChange,
}: UserFiltersProps) {
  const roleLabels = ["Semua", ...roles.map((r) => r.name)];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-gray-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
      {/* Search */}
      <div className="relative w-full md:w-80">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-4 h-4 text-gray-500" />
        </span>
        <input
          type="text"
          id="search-user"
          placeholder="Cari username, email, atau ID..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-teal-500 transition-colors"
        />
      </div>

      {/* Role Pills */}
      <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
        {roleLabels.map((roleName) => (
          <button
            key={roleName}
            onClick={() => onRoleChange(roleName)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              selectedRole === roleName
                ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                : "bg-slate-100 dark:bg-slate-950 text-gray-500 dark:text-gray-400 border border-transparent hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {roleName}
          </button>
        ))}
      </div>
    </div>
  );
}
