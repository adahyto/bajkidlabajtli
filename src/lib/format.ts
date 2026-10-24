/** 149 → "2:29" */
export function clock(total: number): string {
	const h = Math.floor(total / 3600);
	const m = Math.floor((total % 3600) / 60);
	const s = String(total % 60).padStart(2, '0');
	return h ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
}

/** 1 piosenka, 2–4 piosenki, 5 piosenek, 22 piosenki */
export function songs(n: number): string {
	const word =
		n === 1
			? 'piosenka'
			: n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)
				? 'piosenki'
				: 'piosenek';
	return `${n} ${word}`;
}
