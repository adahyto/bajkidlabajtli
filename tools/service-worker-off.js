/*
 * The way out of the app (src/service-worker.ts), if its copies ever keep a broken site in browsers: a worker kept in
 * a browser stays there after it is removed from the code. To use, put this file's content in src/service-worker.ts
 * (keep the name: browsers look for /service-worker.js) and deploy. Every browser that checks for a new version
 * then deletes the copies, removes the worker and reloads its open pages from the network.
 */
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			for (const key of await caches.keys()) await caches.delete(key);
			await self.registration.unregister();
			for (const client of await self.clients.matchAll({ type: 'window' }))
				client.navigate(client.url);
		})()
	);
});
