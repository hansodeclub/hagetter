import { withApi } from '~/utils/api/server'
import { NotFound } from '~/entities/api/HttpResponse'
import head from '~/utils/head'
import { GetInstance } from '~/usecases/GetInstance'
import { ListInstances } from '~/usecases/ListInstances'
import { InstanceDatastoreRepository } from '~/infrastructure/InstanceDatastoreRepository'

export default withApi(async ({ req }) => {
  const instanceName = head(req.query.name)

  // return instance list if instance name is not provided
  if (!instanceName) {
    const action = new ListInstances(new InstanceDatastoreRepository())
    return await action.execute()
  }

  // return instance info
  const action = new GetInstance(new InstanceDatastoreRepository())
  const instance = await action.execute(instanceName)
  if (!instance) throw new NotFound('Instance not found')

  return instance
})
