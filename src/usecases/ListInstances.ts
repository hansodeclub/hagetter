import { IInstanceRepository } from '~/interfaces/InstanceRepository'

export class ListInstances {
  constructor(readonly instanceRepository: IInstanceRepository) {}

  async execute() {
    return await this.instanceRepository.listInstances()
  }
}
