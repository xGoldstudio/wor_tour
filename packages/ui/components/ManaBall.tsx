interface ManaBallProps {
  mana?: number;
}

export default function ManaBall({ mana }: ManaBallProps) {
  return <ManaBallWrapper>{mana}</ManaBallWrapper>;
}

export function ManaBallWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-[40px] w-[40px] flex justify-center items-center z-10 relative">
      <div className="absolute top-[2px] left-[1px] h-[39px] w-[39px] bg-[linear-gradient(60deg,#d193cc_0%,_rgba(212,100,203,1)_100%)] rounded-full flex justify-center items-center blur-[2px]"></div>
      <div className="z-10 absolute h-[38px] w-[38px] bg-[linear-gradient(60deg,_rgba(136,21,127,1)_0%,_rgba(212,100,203,1)_100%)] rounded-full flex justify-center items-center"></div>
      <div
        className="z-10 relative h-[38px] w-[38px] rounded-full
	bg-[radial-gradient(at_95%_15%,#DCA9D8,_rgba(184,121,179,1)_22%,#9f3897_45%,_rgba(184,121,179,1)_68%,_rgba(207,137,201,1)_100%)]
	shadow-md font-[stylised] text-white flex justify-center items-center text-xl"
      >
        {children}
      </div>
    </div>
  );
}
