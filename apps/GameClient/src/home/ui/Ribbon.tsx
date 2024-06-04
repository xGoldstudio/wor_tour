import { cn } from "@repo/ui";

interface RibbonProps {
  children: string;
  className?: string;
}

export default function Ribbon({ children, className }: RibbonProps) {
  return (
    <div
      className={cn("w-full flex justify-center relative mb-6 mt-4", className)}
    >
      <img src="/ribbon.png" className="h-[75px] w-[650px]" />
      <p className="absolute top-[35px] text-xl font-stylised w-full text-center text-slate-800">
        {children}
      </p>
    </div>
  );
}
