import React from 'react';
import { useLocalStore } from 'mobx-react-lite';
import { types } from 'mobx-state-tree';
import TimelineStore from './timelineStore';
import SearchTimelineStore from './searchTimelineStore';
import SessionStore from './sessionStore';
import EditorStore from './editorStore';

export { observer } from 'mobx-react-lite';

export const RootStore = types
  .model('RootStore', {
    session: SessionStore,
    localTimeline: TimelineStore,
    publicTimeline: TimelineStore,
    homeTimeline: TimelineStore,
    favouriteTimeline: TimelineStore,
    searchTimeline: SearchTimelineStore,
    editor: EditorStore,
    error: types.maybeNull(types.frozen<Error>())
  })
  .actions(self => ({
    notifyError(error: Error) {
      self.error = error;
    }
  }));

export type TRootStore = typeof RootStore.Type;

export const storeContext = React.createContext<TRootStore | null>(null);

export const StoreProvider = ({ children }: { children?: React.ReactNode }) => {
  const store = useLocalStore(() =>
    RootStore.create({
      session: {},
      localTimeline: { type: 'local' },
      publicTimeline: { type: 'public' },
      homeTimeline: { type: 'home' },
      favouriteTimeline: { type: 'favourites' },
      searchTimeline: { type: 'search' },
      editor: {}
    })
  );
  return (
    <storeContext.Provider value={store}>{children}</storeContext.Provider>
  );
};

export const useStore = () => {
  const store = React.useContext(storeContext);
  if (!store) {
    throw new Error('useStore() must be used inside StoreProvider');
  }

  return store;
};

// ダサい(typeつかう)
export const useTimeline = (name: string) => {
  const store = useStore();
  if (name === 'local') {
    return store.localTimeline;
  } else if (name === 'public') {
    return store.publicTimeline;
  } else if (name === 'home') {
    return store.homeTimeline;
  } else if (name === 'favourites') {
    return store.favouriteTimeline;
  } else {
    throw Error(`Unknown timeline type: ${name}`);
  }
};

export const useSearchTimeline = () => {
  const store = useStore();
  return store.searchTimeline;
};

export const useLocalTimeline = () => {
  const store = useStore();
  return store.localTimeline;
};

export const useEditor = () => {
  const store = useStore();
  return store.editor;
};

export const useSession = () => {
  const store = useStore();
  return store.session;
};
