import { mkdir, readFile, rename, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { env } from '$env/dynamic/private';
import sharp from 'sharp';

/*
 * Pictures of the videos, fetched from YouTube by the server and kept in DATA_DIR/thumbs, so that the browser of a
 * visitor does not talk to YouTube before a video is played (/prywatnosc). Sizes: m for cards (640×360), l for the
 * big ones (1280×720), s for shorts (540×960, upright). A size YouTube does not have falls back to the next.
 * YouTube's pictures are cut to that size here, once, when fetched: its m has bars above and below (640×480) and
 * its s is 1080×1920, about 150 KB for a card 270 px wide. Fetched again after a week, as the channel may change a
 * picture; when YouTube does not answer, the old one stays.
 */

export type Size = 'm' | 'l' | 's';

const NAMES: Record<Size, string[]> = {
	m: ['sddefault', 'hqdefault', 'mqdefault'],
	l: ['maxresdefault', 'sddefault', 'hqdefault'],
	s: ['oardefault', 'oar2', 'hqdefault']
};
const BOX: Record<Size, [number, number]> = { m: [640, 360], l: [1280, 720], s: [540, 960] };
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const folder = () => join(env.DATA_DIR || '.data', 'thumbs');
const fetching = new Map<string, Promise<Uint8Array | null>>();

async function download(id: string, size: Size): Promise<Uint8Array | null> {
	for (const name of NAMES[size]) {
		const res = await fetch(`https://i.ytimg.com/vi/${id}/${name}.jpg`, {
			signal: AbortSignal.timeout(10_000)
		}).catch(() => null);
		if (res?.ok && (res.headers.get('content-type') ?? '').startsWith('image/'))
			return shrink(new Uint8Array(await res.arrayBuffer()), size);
	}
	return null;
}

/** YouTube's picture cut to the size of its place (BOX); YouTube's own when it cannot be read */
async function shrink(data: Uint8Array, size: Size): Promise<Uint8Array> {
	const [width, height] = BOX[size];
	return sharp(data)
		.resize(width, height, { fit: 'cover' })
		.jpeg({ quality: 78, mozjpeg: true })
		.toBuffer()
		.then((b) => new Uint8Array(b))
		.catch((e) => {
			console.error('thumbnail not shrunk', e);
			return data;
		});
}

/** The picture of a video of the channel (the caller checks the id), or null */
export async function thumb(id: string, size: Size): Promise<Uint8Array | null> {
	// .2: cut to BOX; the pictures saved before that are fetched again
	const path = join(folder(), `${id}-${size}.2.jpg`);
	const saved = await stat(path).catch(() => null);
	if (saved && Date.now() - saved.mtimeMs < MAX_AGE_MS) return readFile(path);
	const key = `${id}-${size}`;
	let job = fetching.get(key);
	if (!job) {
		job = (async () => {
			const data = await download(id, size);
			if (data) {
				await mkdir(folder(), { recursive: true });
				const part = `${path}.${process.pid}.part`;
				await writeFile(part, data);
				await rename(part, path);
			}
			return data;
		})()
			.catch((e) => {
				console.error(`thumbnail ${key} not fetched`, e);
				return null;
			})
			.finally(() => fetching.delete(key));
		fetching.set(key, job);
	}
	return (await job) ?? (saved ? readFile(path) : null);
}
