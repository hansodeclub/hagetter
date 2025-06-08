import React from "react"

export interface H3IconProps extends React.SVGProps<SVGSVGElement> {}

export const H3Icon = (props: H3IconProps) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className="lucide lucide-type"
		{...props}
	>
		<polyline points="4 7 4 4 20 4 20 7" />
		<line x1="9" x2="15" y1="20" y2="20" />
		<line x1="12" x2="12" y1="4" y2="20" />
	</svg>
)
