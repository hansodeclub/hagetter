import { Datastore } from '@google-cloud/datastore';
import { InstanceInfo } from './types';

export const listInstance = async (): Promise<string[]> => {
    const datastore = new Datastore();

    const query = await datastore.createQuery('Instances');
    const [instances] = await datastore.runQuery(query);
    const results = instances.map(instance => instance[datastore.KEY].name);
    return results;
}

export const getInstanceInfo = async (name: string): Promise<InstanceInfo | null> => {
    const datastore = new Datastore();

    const result = await datastore.get(datastore.key(['Instances', name]));

    if (result[0]) {
        return {
            name: name,
            ...result[0],
        }
    } else {
        return null
    }
}
