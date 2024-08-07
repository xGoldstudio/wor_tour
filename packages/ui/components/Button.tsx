import { CardRarity, textureByRarity } from "@repo/lib";
import { cn } from "../lib/utils";

interface ButtonProps {
  children: React.ReactNode;
  action: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  full?: boolean;
  small?: boolean;
  className?: string;
  rarity?: CardRarity;
  forwardRef?: React.RefObject<HTMLButtonElement>;
  width?: string;
}

export default function Button({
  children,
  action,
  full,
  small,
  disabled,
  className,
  rarity = "rare",
  forwardRef,
  width,
}: ButtonProps) {
  return (
    <button
      onClick={action}
      className={cn(
        "rounded-sm overflow-hidden text-nowrap relative z-10 font-semibold shadow-md",
        width !== undefined ? width : full ? "w-full" : "w-min",
        disabled ? "brightness-50" : "brightness-100",
        rarity === "epic" ? "bg-slate-100" : "bg-black"
      )}
      disabled={disabled}
      ref={forwardRef}
    >
      <div
        className="absolute w-full h-full blur-sm"
        style={{
          backgroundImage: `url(${textureByRarity(rarity)})`,
          backgroundSize: "cover",
          backgroundPositionY: "center",
        }}
      />
      <div
        className={cn(
          "text-black h-full flex justify-center items-center relative",
          !small ? "px-12 py-2" : "px-2 py-1",
          className
        )}
      >
        {children}
      </div>
    </button>
  );
}
