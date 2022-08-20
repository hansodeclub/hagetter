import { IInstanceRepository } from '@/core/domains/instance/InstanceRepository'

export class ListInstances {
  constructor(readonly instanceRepository: IInstanceRepository) {}

  async execute() {
    return await this.instanceRepository.listInstances()
  }
}
