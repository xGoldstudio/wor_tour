interface GameCardFlashProps {
  flashRef: React.RefObject<HTMLDivElement>;
  colorA: string;
  colorB: string;
}

export default function GameCardFlash({
  flashRef,
  colorA,
  colorB,
}: GameCardFlashProps) {
  return (
    <div
      ref={flashRef}
      className={`rounded-sm z-10 absolute top-0 w-full h-full bg-gradient-to-b  from-[${colorA}] via-[${colorB}}] via-[37%] to-[${colorA}] opacity-0 origin-top`}
    />
  );
}
