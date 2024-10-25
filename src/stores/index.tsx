import React from "react"

import { TimelineName, timelineLabel, timelineNames } from "@/entities/timeline"
import makeInspectable from "mobx-devtools-mst"
import { useLocalObservable } from "mobx-react-lite"
import { Instance, types } from "mobx-state-tree"
import EditorStore from "./editor"
import SearchTimelineStore, {
	type SearchTimelineStoreType,
} from "./searchTimelineStore"
import SessionStore from "./sessionStore"
import TimelineStore, { type TimelineStoreType } from "./timelineStore"
import UrlSearchTimelineStore, {
	type UrlSearchTimelineStoreType,
} from "./urlSearchTimelineStore"
export { observer } from "mobx-react-lite"

export const RootStore = types
	.model("RootStore", {
		session: SessionStore,
		currentTimelineName: types.maybe(
			types.enumeration<TimelineName>("Timeline", timelineNames),
		),
		localTimeline: TimelineStore,
		publicTimeline: TimelineStore,
		homeTimeline: TimelineStore,
		favouriteTimeline: TimelineStore,
		bookmarkTimeline: TimelineStore,
		searchTimeline: SearchTimelineStore,
		urlSearchTimeline: UrlSearchTimelineStore,
		editor: EditorStore,
		error: types.maybeNull(types.frozen<Error>()),
	})
	.actions((self) => ({
		notifyError(error: Error) {
			self.error = error // see _app.tsx
		},
		setTimeline(timeline: TimelineName) {
			self.currentTimelineName = timeline
		},
	}))
	.views((self) => ({
		get currentTimeline():
			| TimelineStoreType
			| SearchTimelineStoreType
			| UrlSearchTimelineStoreType
			| null {
			const timeline = self.currentTimelineName
			if (!timeline) {
				return null
			}

			if (timeline === "local") {
				return self.localTimeline
			}
			if (timeline === "public") {
				return self.publicTimeline
			}
			if (timeline === "home") {
				return self.homeTimeline
			}
			if (timeline === "favourites") {
				return self.favouriteTimeline
			}
			if (timeline === "bookmarks") {
				return self.bookmarkTimeline
			}
			if (timeline === "search") {
				return self.searchTimeline
			}
			if (timeline === "urls") {
				return self.urlSearchTimeline
			}
			throw new Error(`Unknown timeline type: ${timeline}`)
		},
		get currentTimelineLabel(): string | null {
			const timeline = self.currentTimelineName
			if (!timeline) {
				return null
			}

			if (timeline === "local") {
				return self.localTimeline.label
			}
			if (timeline === "public") {
				return self.publicTimeline.label
			}
			if (timeline === "home") {
				return self.homeTimeline.label
			}
			if (timeline === "favourites") {
				return self.favouriteTimeline.label
			}
			if (timeline === "bookmarks") {
				return self.bookmarkTimeline.label
			}
			if (timeline === "search") {
				return self.searchTimeline.label
			}
			if (timeline === "urls") {
				return self.urlSearchTimeline.label
			}
			return null
		},
	}))

export type TRootStore = Instance<typeof RootStore>

export const storeContext = React.createContext<TRootStore | null>(null)

export const StoreProvider = ({ children }: { children?: React.ReactNode }) => {
	const store = useLocalObservable(() => {
		const sessionStore = SessionStore.create({ id: "defaultSession" })
		return RootStore.create({
			session: sessionStore,
			editor: EditorStore.create({ title: "", description: "" }),
			localTimeline: {
				type: "local",
				label: timelineLabel("local"),
				session: sessionStore.id,
			},
			publicTimeline: {
				type: "public",
				label: timelineLabel("public"),
				session: sessionStore.id,
			},
			homeTimeline: {
				type: "home",
				label: timelineLabel("home"),
				session: sessionStore.id,
			},
			favouriteTimeline: {
				type: "favourites",
				label: timelineLabel("favourites"),
				session: sessionStore.id,
			},
			bookmarkTimeline: {
				type: "bookmarks",
				label: timelineLabel("bookmarks"),
				session: sessionStore.id,
			},
			searchTimeline: {
				type: "search",
				label: timelineLabel("search"),
				session: sessionStore.id,
			},
			urlSearchTimeline: {
				type: "urls",
				label: timelineLabel("urls"),
				session: sessionStore.id,
			},
		})
	})
	if (process.env.NODE_ENV === "development") {
		makeInspectable(store)
	}
	return <storeContext.Provider value={store}>{children}</storeContext.Provider>
}

export const useStore = () => {
	const store = React.useContext(storeContext)
	if (!store) {
		throw new Error("useStore() must be used inside StoreProvider")
	}

	return store
}

// ダサい(typeつかう)
export const useTimeline = (name: string) => {
	const store = useStore()
	if (name === "local") {
		return store.localTimeline
	} else if (name === "public") {
		return store.publicTimeline
	} else if (name === "home") {
		return store.homeTimeline
	} else if (name === "favourites") {
		return store.favouriteTimeline
	} else if (name === "bookmarks") {
		return store.bookmarkTimeline
	} else {
		throw Error(`Unknown timeline type: ${name}`)
	}
}

export const useSearchTimeline = () => {
	const store = useStore()
	return store.searchTimeline
}

export const useUrlSearchTimeline = () => {
	const store = useStore()
	return store.urlSearchTimeline
}

export const useLocalTimeline = () => {
	const store = useStore()
	return store.localTimeline
}

export const useEditor = () => {
	const store = useStore()
	return store.editor
}

export const useSession = () => {
	const store = useStore()
	return store.session
}
