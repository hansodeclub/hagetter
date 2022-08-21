import {
  InstanceInfo,
  InstanceInfoSecret,
} from '@/core/domains/instance/Instance'
import { InstanceFirestoreRepository } from '@/core/infrastructure/server-firestore/InstanceFirestoreRepository'

export const getInstanceList = async (): Promise<InstanceInfo[]> => {
  const instanceRepository = new InstanceFirestoreRepository()
  return await instanceRepository.listInstances()
}

export const getInstanceDetailSecret = async (
  name: string
): Promise<InstanceInfoSecret> => {
  const instanceRepository = new InstanceFirestoreRepository()
  return await instanceRepository.getInstanceSecret(name)
}
