import React from "react";

export type StatCardVariant = "red" | "teal" | "purple" | "orange" | "blue" | "gray";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  variant?: StatCardVariant;
}

export function StatCard({ title, value, icon, description, variant = "gray" }: StatCardProps) {
  const variantClasses: Record<StatCardVariant, { text: string; bgBorder: string }> = {
    red: {
      text: "text-red-400",
      bgBorder: "bg-red-500/10 border-red-500/20 text-red-400",
    },
    teal: {
      text: "text-teal-400",
      bgBorder: "bg-teal-500/10 border-teal-500/20 text-teal-400",
    },
    purple: {
      text: "text-purple-400",
      bgBorder: "bg-purple-500/10 border-purple-500/20 text-purple-400",
    },
    orange: {
      text: "text-orange-500",
      bgBorder: "bg-orange-500/10 border-orange-500/20 text-orange-500",
    },
    blue: {
      text: "text-blue-400",
      bgBorder: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    },
    gray: {
      text: "text-white",
      bgBorder: "bg-gray-800/40 border-gray-800 text-gray-300",
    },
  };

  const currentVariant = variantClasses[variant];

  return (
    <div className="bg-slate-900 border border-gray-800 rounded-xl p-5 flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-gray-400 text-xs font-medium">{title}</span>
          <h3 className={`text-xl font-bold mt-1 font-mono ${currentVariant.text}`}>
            {value}
          </h3>
        </div>
        <div className={`p-2.5 rounded-lg border ${currentVariant.bgBorder}`}>
          {icon}
        </div>
      </div>
      {description && (
        <p className="text-[11px] text-gray-500 mt-2">{description}</p>
      )}
    </div>
  );
}
