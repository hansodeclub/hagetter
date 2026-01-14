import "server-only"

import { Account, fromMastoAccount } from "@/entities/status"
import { MegalodonInterface } from "megalodon"

/**
 * マストドンのアカウント情報を取得する
 * @param client
 * @param server
 * @returns
 */
export const getMyAccount = async (
	client: MegalodonInterface,
	server: string,
): Promise<Account> => {
	const res = await client.verifyAccountCredentials()
	return fromMastoAccount(res.data, server)
}
