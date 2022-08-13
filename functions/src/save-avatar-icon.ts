import * as functions from 'firebase-functions'
import { Storage } from '@google-cloud/storage'
import * as path from 'path'
import fetch from 'node-fetch'

import { db } from './lib/firebase-admin'

const getAvatarMap = async (postId: string) => {
  const page = await db
    .collection('posts')
    .doc(postId)
    .collection('pages')
    .doc('page0')
    .get()

  const data = page.data()
  if (data) {
    const items = data.contents as any[]
    const map = new Map<string, string>()

    for (const item of items) {
      if (item.type === 'status') {
        map.set(item.data.account.avatar, item.data.account.acct)
      }
    }

    return map
  } else {
    throw Error('No page on document ' + postId)
  }
}

const avatarPath = (name: string, url: string, addExt: boolean = true) => {
  const ext = path.extname(url)
  const encoded = Buffer.from(name).toString('base64')
  if (!addExt) return `avatars/${encoded}`
  return `avatars/${encoded}${ext}`
}

const saveAvatarToGcs = async (avatars: Map<string, string>) => {
  const storage = new Storage()
  const bucket = storage.bucket(process.env.GCS_BUCKET!)

  const promises = Array.from(avatars.entries()).map(async ([avatar, acct]) => {
    const acctFile = bucket.file(avatarPath(acct, avatar, false))
    const avatarFile = bucket.file(avatarPath(avatar, avatar))

    if ((await avatarFile.exists())[0]) return // avatar file already exists

    const res = await fetch(avatar)
    if (res.status !== 200) return // Not found

    const buf = Buffer.from(await res.arrayBuffer())

    await avatarFile.save(buf)
    await acctFile.save(buf)
  })

  await Promise.all(promises)
}

export const saveAvatarIcon = functions
  .region('asia-northeast1')
  .firestore.document('posts/{postId}')
  .onWrite(async (change, context) => {
    const post = change.after.data()
    if (!post) return // Post is deleted

    if (!process.env.GCS_BUCKET) throw Error('GCS_BUCKET is not set')

    const postId = context.params.postId
    const avatars = await getAvatarMap(postId)
    avatars.set(post.owner.acct, post.owner.avatar)

    await saveAvatarToGcs(avatars)
  })
