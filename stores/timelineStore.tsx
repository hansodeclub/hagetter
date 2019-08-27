import { cast, types } from 'mobx-state-tree';
import { Status } from '../utils/mastodon/types';
import cookie from 'js-cookie';

const filterStatus = (statuses: Status[], filter: string) => {
    return statuses.filter(status =>
        status.content.includes(filter) ||
        status.account.acct.includes(filter) ||
        status.account.display_name.includes(filter));
}

const fetchTimeline = async (timeline: string, max_id?: string) => {
    let url = `/api/mastodon/${timeline}`;
    if (max_id) url = `${url}?max_id=${max_id}`;
    const res = await fetch(url, {
        headers: {
            Authorization: cookie.get('token')
        }
    })
    const data = await res.json();
    return data;
}

const TimelineStore =
    types.model('TimelineModel', {
        init: types.optional(types.boolean, true),
        loading: types.optional(types.boolean, false),
        type: types.string,
        filter: types.optional(types.string, ''),
        statuses: types.optional(types.array(types.frozen<Status>()), []),
    }).actions(self => ({
        setStatuses(statuses: Status[]) {
            self.statuses = cast(statuses);
        },
        concatStatuses(statuses: Status[]) {
            self.statuses = cast(self.statuses.concat(statuses));
        },
        setFilter(filter: string) {
            self.filter = filter;
        },
        setLoading(loading: boolean) {
            self.init = false;
            self.loading = loading;
        },
        async reload() {
            if (self.loading) return;

            this.setLoading(true);

            const url = `/api/mastodon/${self.type}`;
            const res = await fetch(url, {
                headers: {
                    Authorization: cookie.get('token')
                }
            });
            const data = await res.json();

            this.setStatuses(data.data);
            this.setLoading(false);
        },
        async loadMore() {
            this.setLoading(true);
            const minId = self.statuses.slice(-1);
            const data = await fetchTimeline(self.type, minId.length ? minId[0].id : undefined);
            this.concatStatuses(data.data);
            this.setLoading(false);
        }
    })).views(self => ({
        get filteredStatuses() {
            return filterStatus(self.statuses, self.filter);
        }
    }));

export default TimelineStore;
