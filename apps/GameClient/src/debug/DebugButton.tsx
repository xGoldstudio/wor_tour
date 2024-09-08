import React from "react";
import { cn } from "@repo/ui";
import { CheckCircle } from "lucide-react";

export default function DebugButton({
  children,
  onClick,
  selected,
}: {
  children: React.ReactNode;
  onClick: (event: React.MouseEvent) => void;
  selected?: boolean;
}) {
  return (
    <button
      className={cn(
        "px-2 py-1 flex gap-2 items-center justify-center rounded-sm bg-slate-600 hover:bg-slate-400",
        selected && "bg-white text-black"
      )}
      onClick={onClick}
    >
      {children}
      {selected && <CheckCircle size={16} />}
    </button>
  );
}
