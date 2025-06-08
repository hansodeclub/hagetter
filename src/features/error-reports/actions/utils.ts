import { ErrorReport } from "../../../entities/error-report"

export const errorFirestoreConverter: FirebaseFirestore.FirestoreDataConverter<ErrorReport> =
	{
		toFirestore(error) {
			const { id, ...data } = error
			return data
		},
		fromFirestore(snapshot) {
			const data = snapshot.data()
			return {
				id: snapshot.id,
				page: data.page,
				message: data.message,
				time: data.time,
				stack: data.stack,
			}
		},
	}
