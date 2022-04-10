import { withApi } from '@/utils/api/server'
import { NotFound } from '@/entities/api/HttpResponse'
import head from '@/utils/head'
import { GetInstance } from '@/usecases/GetInstance'
import { ListInstances } from '@/usecases/ListInstances'
import { InstanceFirestoreRepository } from '@/infrastructure/firestore/InstanceFirestoreRepository'

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
