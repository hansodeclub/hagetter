export type TimelineName =
	| "home"
	| "local"
	| "public"
	| "favourites"
	| "bookmarks"
	| "search"
	| "urls"

export const timelineNames: TimelineName[] = [
	"home",
	"local",
	"public",
	"favourites",
	"bookmarks",
	"search",
	"urls",
]

export const isTimelineName = (name: string): name is TimelineName => {
	return timelineNames.includes(name as TimelineName)
}

export const timelineLabel = (name: TimelineName) => {
	const labels = {
		home: "ホーム",
		local: "ローカル",
		public: "連合",
		favourites: "お気に入り",
		bookmarks: "ブックマーク",
		search: "検索",
		urls: "URL指定",
	}

	return labels[name]
}
