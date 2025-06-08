import { useEffect, useState } from "react"

const getHeight = () =>
	window.visualViewport ? window.visualViewport.height : window.innerHeight
const getWidth = () =>
	window.visualViewport ? window.visualViewport.width : window.innerWidth

export const useDocumentRect = () => {
	const [height, setHeight] = useState<number>()
	const [width, setWidth] = useState<number>()

	useEffect(() => {
		const handleResize = (e: Event) => {
			setHeight(getHeight())
			setWidth(getWidth())
		}

		window.addEventListener("resize", handleResize, { passive: true })
		window.addEventListener("orientationchange", handleResize, {
			passive: true,
		})
		window.visualViewport?.addEventListener("resize", handleResize, {
			passive: true,
		})

		return () => {
			window.removeEventListener("resize", handleResize)
			window.removeEventListener("orientationchange", handleResize)
			window.visualViewport?.removeEventListener("resize", handleResize)
		}
	}, [])

	return { height, width }
}

export default useDocumentRect
