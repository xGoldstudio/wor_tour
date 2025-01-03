import { ReactNode } from "react";

export default function createArrayOfElements(Component: (props: {key: number}) => ReactNode, amount: number): ReactNode[] {
	const res = [];
	for (let i = 0; i < amount; i++) {
		res.push(Component({ key: i }));
	}
	return res;
}