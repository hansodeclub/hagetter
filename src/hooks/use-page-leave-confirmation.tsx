import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export const usePageLeaveConfirmation = (disabled = false) => {
	const router = useRouter()
	const [isBrowserBack, setIsBrowserBack] = useState(false)

	useEffect(() => {
		const message: string =
			"このページから移動しますか？編集中の内容は破棄されます。"

		// 2. App内ページへの遷移
		const pageChangeHandler = () => {
			// beforePopStateで既にconfirm表示している場合はスキップ
			if (!isBrowserBack && !window.confirm(message)) {
				throw "changeRoute aborted"
			}
		}

		// 3. App内ページへのブラウザバック
		const setBeforePopState = () => {
			router.beforePopState(() => {
				if (!confirm(message)) {
					// 書き換わってしまったURLを戻す
					window.history.pushState(null, "", router.asPath)
					return false
				}
				// routeChangeStartで再度confirm表示されるのを防ぐ
				setIsBrowserBack(true)
				return true
			})
		}
		const clearBeforePopState = () => {
			router.beforePopState(() => true)
		}

		const beforeUnloadhandler = (event) => {
			event.returnValue = message
			event.preventDefault()
			return false
		}

		if (!disabled) {
			router.events.on("routeChangeStart", pageChangeHandler)
			window.addEventListener("beforeunload", beforeUnloadhandler)
			setBeforePopState()
			return () => {
				router.events.off("routeChangeStart", pageChangeHandler)
				clearBeforePopState()
				window.removeEventListener("beforeunload", beforeUnloadhandler)
			}
		}
	}, [disabled, isBrowserBack, router])
}
