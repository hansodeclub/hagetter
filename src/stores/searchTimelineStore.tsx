import { Status } from "@/features/posts/types"
import { HagetterApiClient } from "@/lib/hagetterApiClient"
import { Instance, cast, types } from "mobx-state-tree"
import SessionStore from "./sessionStore"

const filterStatus = (statuses: Status[], filter: string) => {
	return statuses.filter(
		(status) =>
			status.content.includes(filter) ||
			status.account.acct.includes(filter) ||
			status.account.displayName.includes(filter),
	)
}

const SearchTimelineStore = types
	.model("SearchTimelineModel", {
		label: types.string,
		init: types.optional(types.boolean, true),
		loading: types.optional(types.boolean, false),
		type: types.string,
		statuses: types.optional(types.array(types.frozen<Status>()), []),
		keyword: types.optional(types.string, ""),
		filter: types.optional(types.string, ""),
		session: types.reference(SessionStore),
	})
	.views((self) => ({
		get filteredStatuses() {
			return filterStatus(self.statuses, self.filter)
		},
		get canReload() {
			return false
		},
	}))
	.actions((self) => ({
		setStatuses(statuses: Status[]) {
			self.statuses = cast(statuses)
		},
		setFilter(filter: string) {
			self.filter = filter
		},
		setLoading(loading: boolean) {
			self.init = false
			self.loading = loading
		},
		async reload() {},
		async search(keyword: string) {
			if (self.loading) {
				return
			}

			this.setLoading(true)

			self.keyword = keyword

			const hagetterClient = new HagetterApiClient()
			const statuses = await hagetterClient.getSearchTimeline(
				self.session.token!,
				self.keyword,
			)

			this.setStatuses(statuses)
			this.setLoading(false)
		},
	}))

export default SearchTimelineStore
export interface SearchTimelineStoreType
	extends Instance<typeof SearchTimelineStore> {}
