import { cast, types } from 'mobx-state-tree'

import { Status } from '@/core/domains/post/Status'

import { Links } from '@/lib/api/ApiResponse'
import { HagetterClient } from '@/lib/hagetterClient'

import SessionStore from './sessionStore'

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
    minId: types.maybe(types.string),
    maxId: types.maybe(types.string),
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
    setMaxId(maxId: string) {
      self.maxId = maxId
    },
    setMinId(minId: string) {
      self.minId = minId
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
      const res = await hagetterClient.getTimeline(
        self.type,
        self.session.token
      )
      this.setStatuses(res.data)
      if (res.links?.next) this.setMaxId(res.links.next)
      if (res.links?.prev) this.setMinId(res.links.prev)
      this.setLoading(false)
    },
    async loadMore(newer: boolean = false) {
      this.setLoading(true)
      const hagetterClient = new HagetterClient()
      const res = await hagetterClient.getTimeline(
        self.type,
        self.session.token,
        newer ? undefined : self.maxId,
        newer ? self.minId : undefined
      )

      if (!newer) {
        if (res.links?.next) this.setMaxId(res.links.next)
        else if (self.statuses.length > 0)
          this.setMaxId(self.statuses[self.statuses.length - 1].id)
        else this.setMaxId(undefined)
      } else {
        if (res.links?.prev) this.setMinId(res.links.prev)
        else if (self.statuses.length > 0) this.setMinId(self.statuses[0].id)
        else this.setMinId(undefined)
      }
      this.concatStatuses(res.data)
      this.setLoading(false)
    },
  }))

export default TimelineStore
