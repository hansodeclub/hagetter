import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as striptags from 'striptags'
import algoliasearch from 'algoliasearch'

admin.initializeApp()
const db = admin.firestore()

const itemToText = (item: any) => {
  if (item.type === 'status') {
    return striptags(item.data.content)
  } else {
    return item.data.text
  }
}

const getItemTexts = async (postId: string) => {
  const page = await db
    .collection('posts')
    .doc(postId)
    .collection('pages')
    .doc('page0')
    .get()

  const data = page.data()
  if (data) {
    return data.contents.map(itemToText)
  } else {
    throw Error('No page on document ' + postId)
  }
}

const saveObject = async (postId: string, data: object) => {
  if (!process.env?.ALGOLIA_APP_ID || !process.env?.ALGOLIA_API_KEY) {
    throw Error('Set ALGOLIA_APP_ID and ALGOLIA_API_KEY into .env')
  }

  const client = algoliasearch(
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_API_KEY
  )

  const index = client.initIndex('posts')
  await index.saveObject({ objectID: postId, ...data }).wait()
}

const removeObject = async (postId: string) => {
  if (!process.env?.ALGOLIA_APP_ID || !process.env?.ALGOLIA_API_KEY) {
    throw Error('Set ALGOLIA_APP_ID and ALGOLIA_API_KEY into .env')
  }

  const client = algoliasearch(
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_API_KEY
  )

  const index = client.initIndex('posts')
  await index.deleteObject(postId)
}

const indexPost = async (postId: string, forceIndex = false) => {
  const doc = await db.collection('posts').doc(postId).get()
  const data = doc.data()

  if (data) {
    if (data.visibility !== 'public' && !forceIndex) return

    const date = data.updated_at
      ? Date.parse(data.updated_at)
      : Date.parse(data.created_at)
    const algoliaData = {
      ...data,
      date,
      items: await getItemTexts(postId),
    }

    await saveObject(postId, algoliaData)
    console.log('done')
  } else {
    console.error('unknown document')
  }
}

export const updateAlgoliaIndex = functions
  .region('asia-northeast1')
  .firestore.document('posts/{postId}')
  .onWrite(async (change, context) => {
    const after = change.after.exists ? change.after.data() : undefined
    const postId = context.params.postId

    if (after?.visibility === 'public') {
      console.log(`update ${postId}`)
      await indexPost(postId)
    } else {
      try {
        console.log(`remove ${postId}`)
        await removeObject(postId)
      } catch (err) {
        console.error(err)
      }
    }
  })
