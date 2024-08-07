import { getImageUrl, ICONS } from "@repo/lib";
import { cn } from "@repo/ui";

interface RibbonProps {
  children: React.ReactNode;
  className?: string;
}

export default function Ribbon({ children, className }: RibbonProps) {
  return (
    <div
      className={cn("w-full flex justify-center relative mb-6 mt-4", className)}
    >
      <img src={getImageUrl(ICONS, "/ribbon.png")} className="h-[75px] w-[650px]" />
      <div className="absolute top-[32px] text-3xl font-bold w-full text-center text-slate-800">
        {children}
      </div>
    </div>
  );
}
