import { flow, types } from 'mobx-state-tree'

import { HagetterPostInfo } from '@/features/posts/types'
import { HagetterApiClient } from '@/lib/hagetterApiClient'
import { QueryResult } from '@/types/api'

const PostListStore = types
  .model('PostListModel', {
    recentPosts: types.optional(
      types.array(types.frozen<HagetterPostInfo>()),
      []
    ),
    recentPostLoadingState: types.optional(
      types.enumeration(['loading', 'loaded', 'error']),
      'loading'
    ),
  })
  .actions((self) => ({
    setRecentPosts(items: HagetterPostInfo[]) {
      self.recentPosts.replace(items)
    },
    loadRecentItems: flow(function* () {
      const hagetterClient = new HagetterApiClient()
      self.recentPostLoadingState = 'loading'
      try {
        const res: QueryResult<HagetterPostInfo> =
          yield hagetterClient.getPosts()
        this.setRecentPosts(res.items)
        self.recentPostLoadingState = 'loaded'
      } catch (err) {
        self.recentPostLoadingState = 'error'
      }
    }),
  }))

export default PostListStore
