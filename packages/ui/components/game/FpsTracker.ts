import _ from 'lodash';

export interface FpsTrackerType {
	register: (value: number) => void;
	getFps: () => number;
}

export function FpsTracker() {
	let pointer = 0;
	const array = _.fill(new Array<number>(100), 0);

	return {
		register(value: number) {
			array[pointer] = value;
			pointer = pointer === 99 ? 0 : pointer + 1;
		},
		getFps() {
			const total = array.reduce((acc, curr) => acc + curr, 0);
			return 1000 / (total / 100);
		},
	};
}