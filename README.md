# Bajki dla Bajtli

bajkidlabajtli.pl: the website of the YouTube channel [Bajki dla Bajtli](https://www.youtube.com/@BajkiDlaBajtli),
songs with Pikselek for children of 3–8 and their parents. The site shows the channel's songs, shorts and playlists,
plays them with YouTube's player only after a click, ends a song with its own "Jeszcze raz" / "Następna" instead of
YouTube's suggestions, and tells parents what each song teaches. The plan of the project is outside the repository
(`/home/debian/bajki-plan.md` on the server).

The interface is Polish only.

## Where the songs come from

`src/lib/server/youtube.ts` reads the channel from the YouTube Data API (`YOUTUBE_API_KEY`), at most every
30 minutes, and keeps the last good read in `DATA_DIR/channel.json`; without a key, the RSS feed (the last 15
videos, no lengths or playlists). A new song shows on the site by itself.

- Titles and descriptions are read the way the channel writes them (`src/lib/server/description.ts`): the rules of a
  song (lines with an emoji), "Dla rodziców", help numbers, a short's "Cały teledysk: …" link. Shorts carry
  `#shorts`.
- `src/lib/songs.ts` adds what YouTube has not: a topic for the card, questions for a talk after the song, the
  words of the song.
- Pictures of the videos come through this server (`/miniatura/<id>-<m|l|s>.jpg`, `src/lib/server/thumbs.ts`),
  so a page talks to YouTube only after a video is clicked.

## Running

```sh
npm ci
npm run dev        # http://localhost:5173 (RSS without YOUTUBE_API_KEY)
npm run lint       # Prettier and ESLint
npm run check      # svelte-check
npm run test:unit  # titles and descriptions (Node's test runner)
npm run test:e2e   # Playwright: builds, starts the app on :4173 with tests/fixtures/channel.json, desktop and phone, axe
```

`CHANNEL_FIXTURE=<file>` makes the app read a saved channel instead of YouTube (the tests).

## On the server

`docker compose up -d --build` starts the app on `127.0.0.1:3016`; visitors come through Cloudflare and Apache.
`.env` holds `YOUTUBE_API_KEY` (the key of ldb-api, which Google accepts from this server only) and, at launch,
`INDEXING=1`, which opens the site to search engines (until then `robots.txt` and `X-Robots-Tag: noindex` keep
them out). `/health` tells what was read from YouTube, when, and how many API units today.

The Content Security Policy is enforced (`svelte.config.ts`); browsers report what it blocks to `/csp-report`,
one line per report in the container's log:
`sudo docker compose logs --no-log-prefix nodeserver | grep 'CSP violation'`.

Fonts (Baloo 2, Nunito) are in `static/fonts`, under the SIL Open Font License.
