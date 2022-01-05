import { JsonObject } from '~/utils/serialized'
import { toCamel } from 'snake-camel'

export interface InstanceInfo {
  name: string
  clientId: string
  clientSecret: string
  server: string
  accessToken?: string
}

export const fromObject = (obj: JsonObject<InstanceInfo>): InstanceInfo => {
  return toCamel(obj) as InstanceInfo
}
