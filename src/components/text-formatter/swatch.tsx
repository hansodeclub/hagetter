import React from "react"

export interface SwatchProps {
	color: string
	selected?: boolean
	onClick: () => void
}

const Swatch: React.FC<SwatchProps> = ({ color, onClick, selected }) => {
	return (
		<div
			style={{
				width: 38,
				height: 26,
				borderRadius: "4px",
				cursor: "pointer",
				overflow: "hidden",
				border: selected ? "3px solid #2196f3" : "1px solid #bbb",
				margin: selected ? "-2px" : "-2px",
				padding: "2px",
			}}
			onClick={onClick}
		>
			<div
				style={{
					width: "100%",
					height: "100%",
					backgroundColor: color,
					borderRadius: "2px",
				}}
			/>
		</div>
	)
}

export default Swatch
