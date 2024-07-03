import { useEffect, useRef } from "react";
import { FPS_OBJ } from "./gameBehavior/useGameEvents";

export default function FpsPrint() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const interval = setInterval(() => {
      if (!ref.current) {
        return;
      }
      ref.current.innerHTML = FPS_OBJ.getFps().toFixed(2).toString();
    }, 100);
    return () => clearInterval(interval);
  }, [ref.current]);

  return (
    <div className="text-white">
      Fps: <span ref={ref}>60</span>
    </div>
  );
}
