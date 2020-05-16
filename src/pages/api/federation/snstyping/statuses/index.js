import { withApi, respondError, withApiAuth } from '../../../../../utils/api/server'
import { Datastore } from '@google-cloud/datastore'

const getPosts = withApi(async ({ req, res }) => {
  const datastore = new Datastore()

  const query = datastore
    .createQuery('Hagetter')
    .filter('visibility', '=', 'public')
    .limit(50)
    .order('created_at', {
      descending: true
    })

  const [tasks] = await datastore.runQuery(query)
  const results = tasks.map((task) => ({
    id: task[datastore.KEY].id,
    title: task.title,
    username: task.username
  }))

  res.json({
    count: results.length,
    items: results
  })
})

export default getPosts