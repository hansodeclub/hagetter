import { Status } from "./status"

/**
 * 捏造防止Status
 */
export type VerifiableStatus = Status & { secure: string }

export const isVerifiableStatus = (
	status: Status,
): status is VerifiableStatus => {
	return "secure" in status
}
