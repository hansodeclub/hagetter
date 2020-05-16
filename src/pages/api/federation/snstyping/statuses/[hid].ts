import {
  withApi,
} from '../../../../../utils/api/server'
import { Datastore } from '@google-cloud/datastore'
import head from '../../../../../utils/head'
import { NotFound } from '../../../../../utils/api/response'

const getPost = withApi(async ({ req, res }) => {
  const id = head(req.query.hid)
  if (!id) {
    res.status(403).json({message: 'ID not specified'})
  }

  const datastore = new Datastore()
  const result = await datastore.get(
    datastore.key(['Hagetter', Number.parseInt(id)])
  )

  if (result[0]) {
    res.json(result[0].data.reduce((acc, item) => item.type!=='status' ? acc : acc.concat(item.data), []))
  } else {
    res.status(404).json({message: 'Item not found'})
  }
})

export default getPost
