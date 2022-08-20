import { cast, types } from 'mobx-state-tree'

import { Status } from '@/core/domains/post/Status'

import { HagetterClient } from '@/lib/hagetterClient'

import SessionStore from './sessionStore'

const urlSearchTimelineStore = types
  .model('UrlSearchTimelineModel', {
    loading: types.optional(types.boolean, false),
    type: types.string,
    statuses: types.optional(types.array(types.frozen<Status>()), []),
    session: types.reference(SessionStore),
  })
  .actions((self) => ({
    setStatuses(statuses: Status[]) {
      self.statuses = cast(statuses)
    },
    setLoading(loading: boolean) {
      self.loading = loading
    },
    async search(urls: string) {
      if (self.loading) {
        return
      }

      const urlList = urls.split('\n')
      if (urlList.length === 0) {
        return
      }

      try {
        this.setLoading(true)

        const hagetterClient = new HagetterClient()
        const statuses = await hagetterClient.getUrlTimeline(
          self.session.token,
          urlList
        )
        this.setStatuses(statuses)
      } finally {
        this.setLoading(false)
      }
    },
  }))

export default urlSearchTimelineStore
