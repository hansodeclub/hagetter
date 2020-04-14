import { cast, types } from 'mobx-state-tree'
import { Status } from '../utils/mastodon/types'
import cookie from 'js-cookie'
import SessionStore from './sessionStore'
import { fetchUrlTimeline } from '../utils/hage'

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

        const statuses = await fetchUrlTimeline(self.session.token, urlList)
        this.setStatuses(statuses)
      } finally {
        this.setLoading(false)
      }
    },
  }))

export default urlSearchTimelineStore
