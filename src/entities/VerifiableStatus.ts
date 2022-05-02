import { Status } from './Status'

/**
 * 捏造防止Status
 * まともな名前考える
 */
export type VerifiableStatus = Status & { secure: string }
