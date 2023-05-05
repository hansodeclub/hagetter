import { getAnalytics } from 'firebase/analytics'
import { initializeApp } from 'firebase/app'

import clientConfig from '@/config/client'

export { logEvent } from 'firebase/analytics'

//if (typeof window !== 'undefined' && firebase.apps.length === 0) {
//  firebase.initializeApp(firebaseConfig);
//
// }

const app = initializeApp(clientConfig.firebase)

let analytics
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app)
}

export { analytics }
