import _ from "lodash";

export default function ShinyRotator({
  forwardRef,
}: {
  forwardRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div
      className="w-screen h-screen absolute top-1/2 -translate-y-[600px] scale-1"
      ref={forwardRef}
    >
      <svg
        viewBox="0 0 100 100"
        className="absolute top-0 left-1/2 h-full -translate-x-1/2 drop-shadow-[0px_0px_15px_white] scale-150 opacity-50"
      >
        <defs>
          <linearGradient id="gradient" x1="0" x2="1" y1="0" y2="1">
            <stop offset="40%" stopColor="white" stopOpacity={0} />
            <stop offset="60%" stopColor="white" stopOpacity={0.5} />
            <stop offset="100%" stopColor="white" />
          </linearGradient>
          <linearGradient id="legendaryGradient" x1="0" x2="1" y1="0" y2="1">
            <stop offset="40%" stopColor="#DFFCD3" stopOpacity={0} />
            <stop offset="60%" stopColor="#1D7BFA" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#F02BD4" />
          </linearGradient>
        </defs>

        {_.range(8).map((index) => (
          <polygon
            key={index}
            points="50,50 10,0 0,10"
            fill={`url(${"#gradient"})`}
            transform={`rotate(${index * (360 / 8)} 50 50)`}
          />
        ))}
      </svg>
    </div>
  );
}
