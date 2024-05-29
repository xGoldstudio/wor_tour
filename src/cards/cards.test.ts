import { isLevelValid } from ".";

test('card 1', () => {
	const id = 1;
	expect(isLevelValid(id, 1)).toBeTruthy();
	expect(isLevelValid(id, 2)).toBeTruthy();
	expect(isLevelValid(id, 3)).toBeTruthy();
});

test('card 2', () => {
	const id = 2;
	expect(isLevelValid(id, 1)).toBeTruthy();
	expect(isLevelValid(id, 2)).toBeTruthy();
	expect(isLevelValid(id, 3)).toBeTruthy();
});

test('card 3', () => {
	const id = 3;
	expect(isLevelValid(id, 1)).toBeTruthy();
	expect(isLevelValid(id, 2)).toBeTruthy();
	expect(isLevelValid(id, 3)).toBeTruthy();
});

test('card 4', () => {
	const id = 4;
	expect(isLevelValid(id, 1)).toBeTruthy();
	expect(isLevelValid(id, 2)).toBeTruthy();
	expect(isLevelValid(id, 3)).toBeTruthy();
});

test('card 5', () => {
	const id = 5;
	expect(isLevelValid(id, 1)).toBeTruthy();
	expect(isLevelValid(id, 2)).toBeTruthy();
	expect(isLevelValid(id, 3)).toBeTruthy();
});

test('card 6', () => {
	const id = 6;
	expect(isLevelValid(id, 1)).toBeTruthy();
	expect(isLevelValid(id, 2)).toBeTruthy();
	expect(isLevelValid(id, 3)).toBeTruthy();
});

test('card 7', () => {
	const id = 7;
	expect(isLevelValid(id, 1)).toBeTruthy();
	expect(isLevelValid(id, 2)).toBeTruthy();
	expect(isLevelValid(id, 3)).toBeTruthy();
});

test('card 8', () => {
	const id = 8;
	expect(isLevelValid(id, 1)).toBeTruthy();
	expect(isLevelValid(id, 2)).toBeTruthy();
	expect(isLevelValid(id, 3)).toBeTruthy();
});

test('card 9', () => {
	const id = 9;
	expect(isLevelValid(id, 1)).toBeTruthy();
	expect(isLevelValid(id, 2)).toBeTruthy();
	expect(isLevelValid(id, 3)).toBeTruthy();
});