import React from "react"

export const useColliderX = (
	leftRef: React.RefObject<HTMLElement>,
	rightRef: React.RefObject<HTMLElement>,
) => {
	const [collided, setCollided] = React.useState(false)

	React.useEffect(() => {
		const leftX = leftRef.current?.getBoundingClientRect().right
		const rightX = rightRef.current?.getBoundingClientRect().left
		if (leftX && rightX) {
			setCollided(leftX > rightX)
		}
	}, [leftRef, rightRef])

	return collided
}
