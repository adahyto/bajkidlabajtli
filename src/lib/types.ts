/** What the description of a video tells parents (lib/server/description.ts); every part may be empty */
export type Parents = {
	/** The paragraph before the rules ("Pikselek goni balon… zna kilka prostych zasad:") */
	intro: string;
	/** The rules of the song, one line each, with the emoji they start with */
	rules: { icon: string; text: string }[];
	/** "Dla rodziców": paragraphs and points ("• …"), in order */
	tips: { text: string; point: boolean }[];
	/** Where to call for help ("📞 116 111 – Telefon Zaufania…"), with the sentence before them */
	helpIntro: string;
	help: { icon: string; text: string }[];
	/** "tekst pojawia się na ekranie" */
	singAlong: boolean;
};

export type Video = {
	id: string;
	/** The name of the song, without the channel's prefix, emoji and hashtags ("Gdy się zgubię") */
	title: string;
	/** What follows the name in the YouTube title ("Piosenka dla dzieci: co robić, gdy zgubisz się w sklepie") */
	subtitle: string;
	fullTitle: string;
	description: string;
	published: string;
	/** 0 when not known (the RSS feed has no length) */
	seconds: number;
	short: boolean;
	slug: string;
	parents: Parents;
	/** A short: the full song it comes from ("Cały teledysk: …watch?v=<id>"), when that is on the channel */
	fullId?: string;
};

export type Playlist = {
	id: string;
	title: string;
	description: string;
	slug: string;
	videoIds: string[];
};

export type Channel = {
	videos: Video[];
	playlists: Playlist[];
	/** When this was read from YouTube */
	updated: string;
	source: 'api' | 'rss' | 'fixture';
};
