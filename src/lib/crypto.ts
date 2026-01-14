import crypto from "node:crypto"

export const encrypt = (token: string, encryptionKey: string) => {
	const iv = crypto.randomBytes(16)
	const key = Buffer.from(encryptionKey, "hex")
	const cipher = crypto.createCipheriv("aes-256-cbc", key, iv)
	let encrypted = cipher.update(token, "utf8", "hex")
	encrypted += cipher.final("hex")
	return `${iv.toString("hex")}:${encrypted}`
}

export const decrypt = (token: string, encryptionKey: string) => {
	try {
		const parts = token.split(":")
		if (parts.length !== 2) {
			throw new Error("Invalid token format")
		}

		const [iv, encrypted] = parts
		if (!iv || !encrypted) {
			throw new Error("Invalid token parts")
		}

		const key = Buffer.from(encryptionKey, "hex")
		const decipher = crypto.createDecipheriv(
			"aes-256-cbc",
			key,
			Buffer.from(iv, "hex"),
		)
		let decrypted = decipher.update(encrypted, "hex", "utf8")
		decrypted += decipher.final("utf8")
		return decrypted
	} catch (error) {
		throw new Error("Failed to decrypt token")
	}
}
