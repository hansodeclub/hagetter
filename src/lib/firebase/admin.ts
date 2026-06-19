import { getApp, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

export const firestore = getFirestore(
  getApps().length ? getApp() : initializeApp({})
)
