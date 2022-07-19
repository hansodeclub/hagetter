import { IInstanceRepository } from '@/interfaces/InstanceRepository'
import { InstanceInfo } from '@/entities/Instance'

export class GetInstance {
  constructor(readonly instanceRepository: IInstanceRepository) {}

  async execute(
    name: string,
    remainAccessToken: boolean = false
  ): Promise<InstanceInfo | null> {
    const instanceInfo = await this.instanceRepository.getInstance(name)

    if (!instanceInfo) return null
    if (remainAccessToken) return instanceInfo

    return {
      ...instanceInfo,
      accessToken: undefined,
    }
  }
}
