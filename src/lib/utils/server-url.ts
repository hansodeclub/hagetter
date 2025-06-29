import { headers } from "next/headers"

// Server-side only function using Next.js headers()
export const getHost = async () => {
	if (process.env.NODE_ENV === "production") {
		return process.env.NEXT_PUBLIC_BASE_URL
	}

	const headersList = await headers()
	const host = headersList.get("host")

	return `http://${host}`
}

export default getHost