import { listInstances } from "@/features/instances/actions"
import { LoginPage } from "@/components/pages/login"

export default async function Login() {
	try {
		const instances = await listInstances()
		return <LoginPage instances={instances} />
	} catch (error) {
		console.error("Error fetching instances:", error)
		return (
			<LoginPage 
				instances={[]} 
				error={error instanceof Error ? error : new Error("Failed to fetch instances")} 
			/>
		)
	}
}