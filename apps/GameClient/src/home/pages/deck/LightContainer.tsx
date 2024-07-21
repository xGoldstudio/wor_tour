import React, { useState, useRef, useEffect } from "react";

interface LightContainerProps {
  children: React.ReactNode;
  className?: string;
}

const LightContainer: React.FC<LightContainerProps> = ({
  children,
  className = "",
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative ${className} overflow-hidden `}
      style={{
        backgroundColor: "#2a2a2a",
        color: "white",
      }}
    >
      <div
        className="absolute pointer-events-none z-20"
        style={{
          boxShadow: `
            0 0 40px 20px rgba(255, 255, 255, 0.4),
            0 0 80px 40px rgba(192, 192, 192, 0.3)
          `,
          borderRadius: "50%",
          width: "1px",
          height: "1px",
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          transition: "transform 0.1s ease-out",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default LightContainer;
