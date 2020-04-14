import { cast, types } from 'mobx-state-tree'
import { Status } from '../utils/mastodon/types'
import cookie from 'js-cookie'
import SessionStore from './sessionStore'
import { fetchTimeline } from '../utils/hage'

const filterStatus = (statuses: Status[], filter: string) => {
  return statuses.filter(
    (status) =>
      status.content.includes(filter) ||
      status.account.acct.includes(filter) ||
      status.account.display_name.includes(filter)
  )
}

const TimelineStore = types
  .model('TimelineModel', {
    init: types.optional(types.boolean, true),
    loading: types.optional(types.boolean, false),
    type: types.string,
    filter: types.optional(types.string, ''),
    statuses: types.optional(types.array(types.frozen<Status>()), []),
    session: types.reference(SessionStore),
  })
  .views((self) => ({
    get filteredStatuses() {
      return filterStatus(self.statuses, self.filter)
    },
  }))
  .actions((self) => ({
    setStatuses(statuses: Status[]) {
      self.statuses = cast(statuses)
    },
    concatStatuses(statuses: Status[]) {
      self.statuses = cast(self.statuses.concat(statuses))
    },
    setFilter(filter: string) {
      self.filter = filter
    },
    setLoading(loading: boolean) {
      self.init = false
      self.loading = loading
    },
    async reload() {
      if (self.loading) return

      this.setLoading(true)

      const statuses = await fetchTimeline(self.type, self.session.token)
      this.setStatuses(statuses)
      this.setLoading(false)
    },
    async loadMore() {
      this.setLoading(true)
      const minId = self.statuses.slice(-1)
      const statuses = await fetchTimeline(
        self.type,
        self.session.token,
        minId.length ? minId[0].id : undefined
      )
      this.concatStatuses(statuses)
      this.setLoading(false)
    },
  }))

export default TimelineStore
