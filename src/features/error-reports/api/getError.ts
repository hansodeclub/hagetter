import { firestore } from '@/lib/firebase/admin'

import { ErrorReport } from '../types/ErrorReport'
import { errorFirestoreConverter } from './utils'

export const getError = async (id: string): Promise<ErrorReport | null> => {
  const doc = await firestore
    .collection('errors')
    .withConverter(errorFirestoreConverter)
    .doc(id)
    .get()
  return doc.data()
}
