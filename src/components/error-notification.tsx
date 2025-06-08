import { observer } from "mobx-react-lite"
import React from "react"
import { AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { HagetterApiClient } from "@/lib/hagetterApiClient"
import { useStore } from "@/stores"

const sendError = async (error: Error) => {
	let url
	try {
		const hagetterClient = new HagetterApiClient()
		const errorId = hagetterClient.postError(
			window.location.href,
			error.message,
			error.stack ? error.stack.split("\n") : [],
		)
		url = `${window.location.origin}/errors/${errorId}`
	} catch (err) {}

	window.open(
		`https://handon.club/share?text=${encodeURIComponent(
			`@osa9 バグってるぞ殺すぞ\nERROR: ${error.message}${url && "\n" + url}`,
		)}`,
	)
}

const Action: React.FC<{ error: Error }> = ({ error }) => (
	<Button 
		variant="secondary" 
		size="sm" 
		onClick={() => sendError(error)}
		className="ml-2 bg-white/20 text-white hover:bg-white/30"
	>
		報告する
	</Button>
)

export const ErrorNotification = observer(() => {
	const rootStore = useStore()
	const [open, setOpen] = React.useState(false)
	const [visible, setVisible] = React.useState(false)

	React.useEffect(() => {
		if (rootStore.error) {
			setOpen(true)
			setVisible(true)
			// Auto hide after 6 seconds
			const timer = setTimeout(() => {
				setVisible(false)
				setTimeout(() => setOpen(false), 300) // Allow animation to complete
			}, 6000)
			return () => clearTimeout(timer)
		}
	}, [rootStore.error])

	if (!rootStore.error || !open) return null

	return (
		<div
			className={cn(
				"fixed bottom-4 left-4 z-50 max-w-md transform transition-all duration-300 ease-in-out",
				visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
			)}
		>
			<div className="flex items-center rounded-lg bg-amber-600 p-4 text-white shadow-lg">
				<AlertTriangle className="mr-3 h-5 w-5 flex-shrink-0" />
				<div className="flex-1">
					<p id="message-id" className="text-sm font-medium">
						{rootStore.error.message}
					</p>
				</div>
				<Action error={rootStore.error} />
				<Button
					variant="ghost"
					size="sm"
					onClick={() => {
						setVisible(false)
						setTimeout(() => setOpen(false), 300)
					}}
					className="ml-2 h-6 w-6 p-0 text-white hover:bg-white/20"
				>
					×
				</Button>
			</div>
		</div>
	)
})

export default ErrorNotification