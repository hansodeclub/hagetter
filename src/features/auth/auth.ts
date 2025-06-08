import { NotFound } from "@/features/api/types/HttpResponse"
import { OAuthSignIn } from "@/features/auth/server"
import { getInstanceSecret } from "@/features/instances/actions"

export const signIn = async (
	code: string,
	instanceId: string,
	redirectUri: string,
) => {
	const instanceInfo = await getInstanceSecret(instanceId)
	if (!instanceInfo) {
		throw new NotFound(`Unable to find instance: ${instanceId}`)
	}

	const { name, server, clientId, clientSecret, sns } = instanceInfo

	return OAuthSignIn(
		name,
		server,
		clientId,
		clientSecret,
		sns,
		code,
		redirectUri,
	)
}
