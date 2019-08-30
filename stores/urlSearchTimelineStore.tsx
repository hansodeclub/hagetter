import { cast, types } from 'mobx-state-tree';
import { Status } from '../utils/mastodon/types';
import cookie from 'js-cookie';

const urlSearchTimelineStore = types
  .model('UrlSearchTimelineModel', {
    loading: types.optional(types.boolean, false),
    type: types.string,
    statuses: types.optional(types.array(types.frozen<Status>()), [])
  })
  .actions(self => ({
    setStatuses(statuses: Status[]) {
      self.statuses = cast(statuses);
    },
    setLoading(loading: boolean) {
      self.loading = loading;
    },
    async search(urls: string) {
      if (self.loading) {
        return;
      }

      const urlList = urls.split('\n');
      if (urlList.length === 0) {
        return;
      }

      try {
        this.setLoading(true);

        const res = await fetch(`/api/mastodon/urls`, {
          method: 'POST',
          headers: {
            Authorization: cookie.get('token'),
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ urls: urlList })
        });

        const data = await res.json();
        console.log(data);
        console.log(data.data.statuses);

        // https://github.com/mobxjs/mobx-state-tree#typing-self-in-actions-and-views
        this.setStatuses(data.data.statuses);
      } finally {
        this.setLoading(false);
      }
    }
  }));

export default urlSearchTimelineStore;
