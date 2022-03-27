import { cast, types } from 'mobx-state-tree'
import { Status } from '~/entities/Status'
import SessionStore from './sessionStore'
import { HagetterApiClient } from '~/utils/hage'

const filterStatus = (statuses: Status[], filter: string) => {
  return statuses.filter(
    (status) =>
      status.content.includes(filter) ||
      status.account.acct.includes(filter) ||
      status.account.display_name.includes(filter)
  )
}

const SearchTimelineStore = types
  .model('SearchTimelineModel', {
    init: types.optional(types.boolean, true),
    loading: types.optional(types.boolean, false),
    type: types.string,
    statuses: types.optional(types.array(types.frozen<Status>()), []),
    keyword: types.optional(types.string, ''),
    filter: types.optional(types.string, ''),
    session: types.reference(SessionStore),
  })
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
    async search(keyword: string) {
      if (self.loading) {
        return
      }

      this.setLoading(true)

      if (self.keyword === keyword) {
        return
      }
      self.keyword = keyword

      const hagetterClient = new HagetterApiClient()
      const statuses = await hagetterClient.getSearchTimeline(
        self.session.token,
        self.keyword
      )

      this.setStatuses(statuses)
      this.setLoading(false)
    },
  }))
  .views((self) => ({
    get filteredStatuses() {
      return filterStatus(self.statuses, self.filter)
    },
  }))

export default SearchTimelineStore
