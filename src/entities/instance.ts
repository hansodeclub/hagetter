/**
 * Instance Information (public)
 */
export interface InstanceInfo {
	id: string
	name: string
	server: string
	sns: string
	clientId: string
}

/**
 * Instance Information with tokens (private)
 */
export type InstanceInfoSecret = InstanceInfo & {
	clientSecret: string
	accessToken: string
}
