import { cn } from "@repo/ui";
import { ChevronRight } from "lucide-react";
import usePersistentState from "./usePersistentState";

interface DebugSectionProps {
  title: string;
  children: React.ReactNode;
  dangerous?: boolean;
}

export default function DebugSection({
  title,
  children,
  dangerous,
}: DebugSectionProps) {
  const [isOpen, setIsOpen] = usePersistentState(
    `debug-section-${title}`,
    false
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 items-center hover:bg-slate-600 w-full px-4 py-2" onClick={() => setIsOpen(!isOpen)}>
        <p className={cn(dangerous && "text-red-600 font-bold")}>{title}:</p>
        <ChevronRight size={20} className={cn(isOpen && "rotate-90", "transition-transform")} />
      </div>
      {isOpen && (
        <div
          className={cn(
            "px-4",
            dangerous && "border-4 border-red-600 text-red-600 p-2 mx-4"
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
