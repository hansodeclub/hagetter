import { IncomingMessage } from "http"

export const getUrlHost = (
	req: IncomingMessage,
	localhostDomain: string | undefined,
) => {
	let protocol = "https:"
	let host = (req ? req.headers.host : window.location.host) as string
	if (host.indexOf("localhost") > -1) {
		if (localhostDomain) host = localhostDomain
		protocol = "http:"
	}

	return {
		protocol: protocol,
		host: host,
	}
}

// Client-side function for getting host
export const getClientHost = () => {
	if (process.env.NODE_ENV === "production") {
		return process.env.NEXT_PUBLIC_BASE_URL
	}

	if (typeof window !== "undefined") {
		return `${window.location.protocol}//${window.location.host}`
	}

	// Fallback for SSR
	return "http://localhost:3000"
}
