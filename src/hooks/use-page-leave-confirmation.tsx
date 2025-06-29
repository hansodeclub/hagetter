import { useEffect } from "react"

export const usePageLeaveConfirmation = (disabled = false) => {
	useEffect(() => {
		if (disabled) return

		const message: string =
			"このページから移動しますか？編集中の内容は破棄されます。"

		const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
			event.returnValue = message
			event.preventDefault()
			return false
		}

		window.addEventListener("beforeunload", beforeUnloadHandler)
		
		return () => {
			window.removeEventListener("beforeunload", beforeUnloadHandler)
		}
	}, [disabled])
}
