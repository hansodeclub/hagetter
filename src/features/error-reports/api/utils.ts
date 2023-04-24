import { ErrorReport } from '../types/ErrorReport'

export const errorFirestoreConverter: FirebaseFirestore.FirestoreDataConverter<ErrorReport> =
  {
    toFirestore(error) {
      const { id, ...data } = error
      return { ...data }
    },
    fromFirestore(snapshot) {
      const data = snapshot.data()!
      return {
        id: snapshot.id,
        ...data,
      } as ErrorReport
    },
  }
