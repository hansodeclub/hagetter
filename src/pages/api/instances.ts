import { InstanceFirestoreRepository } from '@/core/infrastructure/firestore/InstanceFirestoreRepository'
import { GetInstance } from '@/core/usecases/GetInstance'
import { ListInstances } from '@/core/usecases/ListInstances'

import { NotFound } from '@/lib/api/HttpResponse'
import { withApi } from '@/lib/api/server'
import head from '@/lib/head'

export default withApi(async ({ req }) => {
  const instanceName = head(req.query.name)

  // return instance list if instance name is not provided
  if (!instanceName) {
    const action = new ListInstances(new InstanceFirestoreRepository())
    return await action.execute()
  }

  // return instance info
  const action = new GetInstance(new InstanceFirestoreRepository())
  const instance = await action.execute(instanceName)
  if (!instance) throw new NotFound('Instance not found')

  return instance
})
