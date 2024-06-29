import React from "react"

export interface MultilineTextProps {
	text: string
}

export const MultilineText: React.FC<MultilineTextProps> = ({ text }) => {
	return (
		<>
			{text.split(/(\n)/).map((item) => {
				return (
					<React.Fragment key={item}>
						{item.match(/\n/) ? <br /> : item}
					</React.Fragment>
				)
			})}
		</>
	)
}

export default MultilineText
