import { firestore } from "@/lib/firebase/admin"
import { InstanceInfo, InstanceInfoSecret } from "../../entities/instance"

const instanceConverter: FirebaseFirestore.FirestoreDataConverter<InstanceInfo> =
	{
		toFirestore(instanceInfo) {
			const { id, ...data } = instanceInfo
			return data
		},
		fromFirestore(snapshot) {
			const data = snapshot.data()
			return {
				id: snapshot.id,
				name: data.name,
				server: data.server,
				sns: data.sns,
				clientId: data.client_id,
			}
		},
	}

const instanceSecretConverter: FirebaseFirestore.FirestoreDataConverter<InstanceInfoSecret> =
	{
		toFirestore(instanceInfo) {
			const { id, ...data } = instanceInfo
			return data
		},
		fromFirestore(snapshot) {
			const data = snapshot.data()
			return {
				id: snapshot.id,
				name: data.name,
				server: data.server,
				sns: data.sns,
				clientId: data.client_id,
				clientSecret: data.client_secret,
				accessToken: data.access_token,
			}
		},
	}

export type AddInstanceParams = Omit<InstanceInfo, "id">

/**
 * インスタンス情報を追加する
 */
export const addInstance = async (instance: AddInstanceParams) => {
	// IDは自動付与されるためダミーを入れる
	const input = {
		id: "",
		...instance,
	}

	const doc = await firestore
		.collection("instances")
		.withConverter(instanceConverter)
		.add(input)

	return { id: doc.id }
}

/**
 * インスタンス情報を取得する
 */
export const listInstances = async (): Promise<InstanceInfo[]> => {
	const snapshot = await firestore
		.collection("instances")
		.withConverter(instanceConverter)
		.get()

	return snapshot.docs.map((doc) => doc.data())
}

/**
 * インスタンス情報を取得する
 * @param name
 */
export const getInstance = async (
	name: string,
): Promise<InstanceInfo | null> => {
	const doc = await firestore
		.collection("instances")
		.withConverter(instanceConverter)
		.doc(name)
		.get()

	return doc.data() || null
}

/**
 * Secret Tokenを含むインスタンス情報を取得する
 * @param name
 */
export const getInstanceSecret = async (
	name: string,
): Promise<InstanceInfoSecret | null> => {
	const doc = await firestore
		.collection("instances")
		.withConverter(instanceSecretConverter)
		.doc(name)
		.get()

	if (!doc.exists) return null
	return doc.data() || null
}
