import { Status } from "@/features/posts/types"
import { HagetterApiClient } from "@/lib/hagetterApiClient"
import { Instance, cast, types } from "mobx-state-tree"
import SessionStore from "./sessionStore"

const UrlSearchTimelineStore = types
	.model("UrlSearchTimelineModel", {
		label: types.string,
		loading: types.optional(types.boolean, false),
		type: types.string,
		statuses: types.optional(types.array(types.frozen<Status>()), []),
		session: types.reference(SessionStore),
	})
	.views((self) => ({
		get canReload() {
			return false
		},
	}))
	.actions((self) => ({
		setStatuses(statuses: Status[]) {
			self.statuses = cast(statuses)
		},
		setLoading(loading: boolean) {
			self.loading = loading
		},
		async reload() {},
		async search(urls: string) {
			if (self.loading) {
				return
			}

			const urlList = urls.split("\n")
			if (urlList.length === 0) {
				return
			}

			try {
				this.setLoading(true)

				const hagetterClient = new HagetterApiClient()
				const statuses = await hagetterClient.getUrlTimeline(
					self.session.token!,
					urlList,
				)
				this.setStatuses(statuses)
			} finally {
				this.setLoading(false)
			}
		},
	}))

export default UrlSearchTimelineStore
export interface UrlSearchTimelineStoreType
	extends Instance<typeof UrlSearchTimelineStore> {}
