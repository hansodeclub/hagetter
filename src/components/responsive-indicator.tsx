import React from "react"

export const ResponsiveIndicator: React.FC = () => {
	if (process.env.NODE_ENV === "production") {
		return null
	}

	return (
		<div className="fixed bottom-1 left-1 z-[9999] flex h-4 w-6 items-center justify-center rounded bg-gray-800 p-2 font-bold text-white text-xs">
			<div className="block sm:hidden">xs</div>
			<div className="hidden sm:block md:hidden">sm</div>
			<div className="hidden md:block lg:hidden">md</div>
			<div className="hidden lg:block xl:hidden">lg</div>
			<div className="hidden xl:block">xl</div>
		</div>
	)
}
