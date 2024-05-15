export default function callOnce<T>(fn: () => T, test: boolean) {
	return (test ? null : fn()) as T;
}