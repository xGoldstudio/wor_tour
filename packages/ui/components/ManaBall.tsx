import { cn } from "../lib/utils";

interface ManaBallProps {
  mana?: number;
  size?: number;
}

export default function ManaBall({ mana, size }: ManaBallProps) {
  return <ManaBallWrapper size={size}>{mana}</ManaBallWrapper>;
}

interface ManaBallWrapperProps {
  children: React.ReactNode;
  size?: number;
}

export function ManaBallWrapper({ children, size }: ManaBallWrapperProps) {
  return (
    <div
      className={cn(
        "flex justify-center items-center z-10 relative",
        "h-[40px] w-[40px]",
      )}
      style={{
        transform: `scale(${size ?? 1})`,
      }}
    >
      <div
        className={cn(
          "absolute top-[2px] left-[1px]  bg-[linear-gradient(60deg,#d193cc_0%,_rgba(212,100,203,1)_100%)] rounded-full flex justify-center items-center blur-[2px]",
          "h-[39px] w-[39px]"
        )}
      ></div>
      <div
        className={cn(
          "z-10 absolute bg-[linear-gradient(60deg,_rgba(136,21,127,1)_0%,_rgba(212,100,203,1)_100%)] rounded-full flex justify-center items-center",
          "h-[38px] w-[38px]"
        )}
      ></div>
      <div
        className={cn(
          "z-10 relative  rounded-full bg-[radial-gradient(at_95%_15%,#DCA9D8,_rgba(184,121,179,1)_22%,#9f3897_45%,_rgba(184,121,179,1)_68%,_rgba(207,137,201,1)_100%)] shadow-md font-[stylised] text-white flex justify-center items-center text-xl",
          "h-[38px] w-[38px]"
        )}
      >
        {children}
      </div>
    </div>
  );
}
