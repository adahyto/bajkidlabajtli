import { test } from 'node:test';
import assert from 'node:assert/strict';
import { songGrid, wideOnes, xlColumns } from '../../src/lib/grid.ts';

// Every row full: a wide card counts twice
const rows = (n: number, cols: number) => {
	const wide = wideOnes(n, cols);
	const places = n + wide.length;
	assert.equal(places % cols, 0, `${n} songs in ${cols} columns`);
	// No wide card would have to start in the last place of a row
	let at = 0;
	for (let i = 0; i < n; i++) {
		const size = wide.includes(i) ? 2 : 1;
		assert.ok((at % cols) + size <= cols, `${n} songs in ${cols} columns: card ${i} does not fit`);
		at += size;
	}
};

test('the rows of songs are always full', () => {
	for (let n = 2; n <= 40; n++) for (const cols of [2, 3, 4]) if (n >= cols) rows(n, cols);
});

test('5 songs: 3 columns with the newest wide; 7: 4 columns', () => {
	assert.equal(xlColumns(5), 3);
	assert.deepEqual(wideOnes(5, 3), [0]);
	assert.equal(xlColumns(7), 4);
	assert.deepEqual(wideOnes(7, 4), [0]);
	assert.deepEqual(wideOnes(7, 3), [0, 2]);
	assert.deepEqual(songGrid(5).wide, [['md', 'lg', 'xl'], [], [], [], []]);
});

test('4 songs: full rows in 2 and 4 columns, in 3 two wide ones', () => {
	assert.deepEqual(songGrid(4), { xlCols: 4, wide: [['lg'], [], ['lg'], []] });
	assert.deepEqual(songGrid(6).wide.flat(), []);
});
