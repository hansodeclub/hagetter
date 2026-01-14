import { HagetterItem, VerifiableHagetterItem } from "@/entities/post"
import { Status, fromMastoStatus } from "@/entities/status"
import { VerifiableStatus } from "@/entities/verifiable-status"
import { decrypt, encrypt } from "@/lib/crypto"
import { fromJson, toJson } from "@/lib/serializer"

import { serverConfig } from "@/config/server"
/**
 * ステータスの捏造防止のために暗号化情報を付与する(TODO: JWSに置き換え)
 * @param status
 */
export const signStatus = (status: Status): VerifiableStatus => {
	return {
		...status,
		secure: encrypt(toJson(status), serverConfig.encryptKey),
	}
}

/**
 * 入力されたステータスが本物か確認する(TODO: JWSに置き換え)
 * @param secureStatus
 */
export const verifyStatus = (secureStatus: VerifiableStatus): Status => {
	const status = fromJson<Status>(
		decrypt(secureStatus.secure, serverConfig.encryptKey),
	)
	if (secureStatus.id !== status.id) throw Error("Invalid Status")

	return status
}

export const verifyItems = (
	items: VerifiableHagetterItem[],
): HagetterItem[] => {
	try {
		return items.map((item) => {
			if (item.type === "status") {
				return {
					...item,
					data: verifyStatus(item.data),
				}
			} else return item
		})
	} catch (err) {
		console.error(err)
		throw Error("Invalid Status")
	}
}

/**
 * Mastodon APIのStatusを内部形式のStatusに変換する
 * @param statuses
 * @param server
 */
export const transformStatus = (
	statuses: Entity.Status[],
	instance: string,
): VerifiableStatus[] => {
	return statuses.map((mastoStatus) => {
		const status = fromMastoStatus(mastoStatus, instance)
		return signStatus(status)
	})
}
