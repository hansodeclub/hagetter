import { cast, types } from 'mobx-state-tree'
import { Status } from '@/entities/Status'
import SessionStore from './sessionStore'
import { HagetterClient } from '@/utils/hagetterClient'

const filterStatus = (statuses: Status[], filter: string) => {
  return statuses.filter(
    (status) =>
      status.content.includes(filter) ||
      status.account.acct.includes(filter) ||
      status.account.displayName.includes(filter)
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

      const hagetterClient = new HagetterClient()
      const statuses = await hagetterClient.getTimeline(
        self.type,
        self.session.token
      )
      this.setStatuses(statuses)
      this.setLoading(false)
    },
    async loadMore() {
      this.setLoading(true)
      const minId = self.statuses.slice(-1)
      const hagetterClient = new HagetterClient()
      const statuses = await hagetterClient.getTimeline(
        self.type,
        self.session.token,
        minId.length ? minId[0].id : undefined
      )
      this.concatStatuses(statuses)
      this.setLoading(false)
    },
  }))

export default TimelineStore
