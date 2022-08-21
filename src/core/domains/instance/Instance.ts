export interface InstanceInfo {
  id: string
  name: string
  server: string
  sns: string
  clientId: string
  clientSecret: string
}

/**
 * Instance Information with tokens
 */
export type InstanceInfoSecret = InstanceInfo & {
  accessToken: string
}
