import React from 'react'
import { useLocalStore } from 'mobx-react-lite'
import { types, Instance } from 'mobx-state-tree'
import TimelineStore from './timelineStore'
import SearchTimelineStore from './searchTimelineStore'
import SessionStore from './sessionStore'
import EditorStore from './editorStore'
import UrlSearchTimelineStore from './urlSearchTimelineStore'
import makeInspectable from 'mobx-devtools-mst'

export { observer } from 'mobx-react-lite'

export const RootStore = types
  .model('RootStore', {
    session: SessionStore,
    localTimeline: TimelineStore,
    publicTimeline: TimelineStore,
    homeTimeline: TimelineStore,
    favouriteTimeline: TimelineStore,
    searchTimeline: SearchTimelineStore,
    urlSearchTimeline: UrlSearchTimelineStore,
    editor: EditorStore,
    error: types.maybeNull(types.frozen<Error>()),
  })
  .actions((self) => ({
    notifyError(error: Error) {
      self.error = error // see _app.tsx
    },
  }))

export type TRootStore = Instance<typeof RootStore>

export const storeContext = React.createContext<TRootStore | null>(null)

export const StoreProvider = ({ children }: { children?: React.ReactNode }) => {
  const store = useLocalStore(() => {
    const sessionStore = SessionStore.create({ id: 'defaultSession' })
    return RootStore.create({
      session: sessionStore,
      localTimeline: { type: 'local', session: sessionStore.id },
      publicTimeline: { type: 'public', session: sessionStore.id },
      homeTimeline: { type: 'home', session: sessionStore.id },
      favouriteTimeline: { type: 'favourites', session: sessionStore.id },
      searchTimeline: { type: 'search', session: sessionStore.id },
      urlSearchTimeline: { type: 'urls', session: sessionStore.id },
      editor: { title: '', description: '' },
    })
  })
  if (process.env.NODE_ENV === 'development') {
    makeInspectable(store)
  }
  return <storeContext.Provider value={store}>{children}</storeContext.Provider>
}

export const useStore = () => {
  const store = React.useContext(storeContext)
  if (!store) {
    throw new Error('useStore() must be used inside StoreProvider')
  }

  return store
}

// ダサい(typeつかう)
export const useTimeline = (name: string) => {
  const store = useStore()
  if (name === 'local') {
    return store.localTimeline
  } else if (name === 'public') {
    return store.publicTimeline
  } else if (name === 'home') {
    return store.homeTimeline
  } else if (name === 'favourites') {
    return store.favouriteTimeline
  } else {
    throw Error(`Unknown timeline type: ${name}`)
  }
}

export const useSearchTimeline = () => {
  const store = useStore()
  return store.searchTimeline
}

export const useUrlSearchTimeline = () => {
  const store = useStore()
  return store.urlSearchTimeline
}

export const useLocalTimeline = () => {
  const store = useStore()
  return store.localTimeline
}

export const useEditor = () => {
  const store = useStore()
  return store.editor
}

export const useSession = () => {
  const store = useStore()
  return store.session
}
