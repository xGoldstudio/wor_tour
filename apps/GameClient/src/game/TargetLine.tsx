import { useEffect, useRef, useState } from "react";

export interface Point {
  x: number;
  y: number;
}

interface DistanceAndAngle {
  distance: number;
  angle: number;
}

function TargetLine() {
  const elementRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [angle, setAngle] = useState(0);

  const calculateDistanceAndAngle = (
    position: Point,
    mousePosition: Point
  ): DistanceAndAngle => {
    const deltaX = mousePosition.x - position.x;
    const deltaY = mousePosition.y - position.y;
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    let angleInRadians = Math.atan2(deltaY, deltaX);
    if (angleInRadians < 0) {
      angleInRadians += 2 * Math.PI;
    }
    const angleInDegrees = angleInRadians * (180 / Math.PI);
    return { distance, angle: angleInDegrees - 90 };
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const element = elementRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();

      const distanceAndAngle = calculateDistanceAndAngle(
        { x: rect.left, y: rect.top },
        { x: event.pageX, y: event.pageY }
      );
      setAngle(distanceAndAngle.angle);
      setDistance(distanceAndAngle.distance);
    };

    if (elementRef) {
      window.addEventListener("mousemove", handleMouseMove);
    }
  }, [elementRef]);

  return (
    <div className="absolute top-0 left-1/2 -translate-x-2/4">
      <div className="absolute top-0 left-0" ref={elementRef} />
      <div
        className="absolute w-[1px] rounded-full bg-slate-600 left-0 top-0 z-10 origin-top pointer-events-none"
        style={{
          transform: `translateX(-50%) rotate(${angle}deg)`,
          height: `${distance * 1}px`,
          boxShadow: "0px 0px 2px 2px rgba(0,0,0,0.75)",
        }}
      ></div>
    </div>
  );
}

export default TargetLine;
