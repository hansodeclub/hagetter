import { Status } from './Status'

/**
 * 捏造防止Status
 */
export type VerifiableStatus = Status & { secure: string }
