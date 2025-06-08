import React from "react"

export type ScrollState = "at-top" | "scrolling-up" | "scrolling-down"

export const useScrollState = (topThreshold = 100): ScrollState => {
	const [scrollState, setScrollState] = React.useState<ScrollState>("at-top")

	React.useEffect(() => {
		let lastScrollTop = 0
		const onScroll = () => {
			const scrollY = window.scrollY
			const scrollState =
				scrollY < lastScrollTop ? "scrolling-up" : "scrolling-down"
			setScrollState(scrollY < topThreshold ? "at-top" : scrollState)
			lastScrollTop = scrollY
		}

		window.addEventListener("scroll", onScroll, { passive: true })
		return () => window.removeEventListener("scroll", onScroll)
	}, [topThreshold])

	return scrollState
}
