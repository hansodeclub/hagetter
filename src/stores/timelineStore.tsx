import { cast, types } from 'mobx-state-tree'

import { HagetterApiClient } from '@/lib/hagetterApiClient'

import { Status } from '@/features/posts/types'

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

      const hagetterClient = new HagetterApiClient()
      const res = await hagetterClient.getTimeline(
        self.type,
        self.session.token!
      )
      this.setStatuses(res.data)
      if (res.links?.next) this.setMaxId(res.links.next)
      else if (res.data.length > 0)
        this.setMaxId(res.data[res.data.length - 1].id)
      if (res.links?.prev) this.setMinId(res.links.prev)
      else if (res.data.length > 0) this.setMinId(res.data[0].id)
      this.setLoading(false)
    },
    async loadMore(newer: boolean = false) {
      this.setLoading(true)
      const hagetterClient = new HagetterApiClient()
      const res = await hagetterClient.getTimeline(
        self.type,
        self.session.token!,
        newer ? undefined : self.maxId,
        newer ? self.minId : undefined
      )

      if (!newer) {
        if (res.links?.next) this.setMaxId(res.links.next)
        else if (res.data.length > 0) {
          this.setMaxId(res.data[res.data.length - 1].id)
        } else this.setMaxId(undefined)
      } else {
        if (res.links?.prev) this.setMinId(res.links.prev)
        else if (res.data.length > 0) this.setMinId(res.data[0].id)
        else this.setMinId(undefined)
      }
      this.concatStatuses(res.data)
      this.setLoading(false)
    },
  }))

export default TimelineStore
