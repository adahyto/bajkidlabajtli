/*
 * The grid of songs on the home page without a half-empty last row: a card takes two columns
 * (components/VideoCard.svelte) where the songs do not fill the rows. From 1100 px the grid has 3 or 4 columns,
 * whichever needs fewer wide cards (on a tie 4); 900–1099 px 3, 640–899 px 2, a phone 1. The wide cards are the
 * first of their rows, from the newest: in 2 columns one alone, in 3 a wide and a normal one, in 4 two wide or a
 * wide and two normal ones.
 */

export type Width = 'md' | 'lg' | 'xl';

/** How many places the last row lacks */
const missing = (n: number, cols: number) => (n < cols ? 0 : (cols - (n % cols)) % cols);

/** The indexes of the cards that take two columns */
export function wideOnes(n: number, cols: number): number[] {
	const wide: number[] = [];
	let left = missing(n, cols);
	for (let i = 0; left > 0 && i < n;) {
		wide.push(i);
		left--;
		if (cols === 4 && left > 0) {
			wide.push(i + 1);
			left--;
			i += 2;
		} else i += cols - 1;
	}
	return wide;
}

export const xlColumns = (n: number) => (missing(n, 3) < missing(n, 4) ? 3 : 4);

/** For each card, the widths at which it is wide */
export function songGrid(n: number): { xlCols: number; wide: Width[][] } {
	const xlCols = xlColumns(n);
	const at = { md: wideOnes(n, 2), lg: wideOnes(n, 3), xl: wideOnes(n, xlCols) };
	return {
		xlCols,
		wide: Array.from({ length: n }, (_, i) =>
			(['md', 'lg', 'xl'] as const).filter((width) => at[width].includes(i))
		)
	};
}
