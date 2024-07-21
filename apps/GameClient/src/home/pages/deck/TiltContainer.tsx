import React, { useState, useRef, useEffect, ReactNode } from "react";
import { motion, MotionStyle } from "framer-motion";

interface TiltContainerProps {
  children: ReactNode;
  maxTilt?: number;
}

interface TiltState {
  x: number;
  y: number;
}

const TiltContainer: React.FC<TiltContainerProps> = ({
  children,
  maxTilt = 40,
}) => {
  const [tilt, setTilt] = useState<TiltState>({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      const tiltX = (mouseY / (rect.height / 2)) * maxTilt;
      const tiltY = -(mouseX / (rect.width / 2)) * maxTilt;

      setTilt({ x: tiltX, y: tiltY });
    };

    const handleMouseLeave = () => {
      setTilt({ x: 0, y: 0 });
    };

    const element = ref.current;
    if (element) {
      element.addEventListener("mousemove", handleMouseMove);
      element.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (element) {
        element.removeEventListener("mousemove", handleMouseMove);
        element.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [maxTilt]);

  const motionStyle: MotionStyle = {
    transformStyle: "preserve-3d",
    perspective: "1000px",
  };

  return (
    <motion.div
      ref={ref}
      className=" rounded-lg shadow-lg transition-all duration-100 ease-out"
      style={motionStyle}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
      }}
    >
      {children}
    </motion.div>
  );
};

export default TiltContainer;
