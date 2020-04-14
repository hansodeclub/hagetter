import {cast, types} from 'mobx-state-tree';
import {Status} from '../utils/mastodon/types';
import moment from 'moment';
import stable from 'stable';
import HagetterItem from "./hagetterItem";


export interface TextItem {
    text: string,
}


const generateId = () => {
    return Date.now();
}

const HagetterStore =
    types.model('HagetterModel', {
        init: types.optional(types.boolean, true),
        loading: types.optional(types.boolean, false),
        status: types.maybeNull(types.number),
        id: types.string,
        title: types.string,
        description: types.string,
        items: types.optional(types.array(HagetterItem), [])
    }).actions(self => ({
        setId(id: string) {
            self.id = id;
        },
        setLoading(loading: boolean) {
            self.init = false;
            self.loading = loading;
        },
        setStatus(status: number) {
            self.status = status;
        },
        async getItem(id: string) {
            if(self.loading) return;
            this.setLoading(true);
            const result = await fetch(`/api/post?id=${id}`);
            this.setStatus(result.status);
            if (result.status == 200) {

            }
            this.setLoading(false);
        }
    }));

export default HagetterStore;