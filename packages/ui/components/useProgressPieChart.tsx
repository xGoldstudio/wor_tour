import React from 'react';

export default function usePieChartProgress() {
	const ref = React.useRef<SVGPathElement>(null);

	const Element = () => (
    <svg className="w-full h-full scale-150 -rotate-90" viewBox="-1 -1 2 2">
      <path d={getPathData(0)} fill="#f1f5f9" ref={ref} />
    </svg>
  );

	function update(percent: number) {
		if (ref.current) {
			ref.current.setAttribute("d", getPathData(percent));
		}
	}

  return {
		Element,
		update,
	};
}

function getPathData(percent: number) {
  const [startX, startY] = getCoordinatesForPercent(0);
  const [endX, endY] = getCoordinatesForPercent(percent);

  // if the slice is more than 50%, take the large arc (the long way around)
  const largeArcFlag = percent > 0.5 ? 1 : 0;

  // create an array and join it just for code readability
  return [
    `M ${startX} ${startY}`, // Move
    `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
    `L 0 0`, // Line
  ].join(" ");
}

function getCoordinatesForPercent(percent: number) {
  const x = Math.cos(2 * Math.PI * percent);
  const y = Math.sin(2 * Math.PI * percent);
  return [x, y];
}
