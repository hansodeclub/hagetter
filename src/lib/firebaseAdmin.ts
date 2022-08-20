import admin from 'firebase-admin'
import { getFirestore } from 'firebase-admin/firestore'

const initializeApp = () => {
  return admin.initializeApp({})
}

export const firestore = getFirestore(
  admin.apps.length ? admin.app() : initializeApp()
)
