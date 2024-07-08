import React from "react"

export const AnyPost: React.FC = () => {
	return (
		<div>
			<a
				href="https://anypost.dev/share"
				onClick={(e) => {
					window.open(
						`https://anypost.dev/share?s=${location.href}&t=${document.title}`,
						"",
						"width=500,height=750",
					)
					e.preventDefault()
					return false
				}}
				style={{ color: "#444", textDecorationLine: "none" }}
			>
				<div
					style={{
						display: "inline-block",
						background: "#fff",
						border: "1px solid #eee",
						padding: "10px 2px",
						borderRadius: "4px",
						textAlign: "center",
						width: "60px",
						lineHeight: "7px",
						fontFamily: "Avenir,Helvetica,Arial,sans-serif",
					}}
				>
					<img
						src="https://anypost.dev/external-assets/share-b.svg"
						width="24"
						height="24"
						alt="share"
						style={{ marginLeft: "14px" }}
					/>
					<div
						style={{ fontSize: "12px", marginTop: "9px", fontWeight: "bold" }}
					>
						AnyPost
					</div>
				</div>
			</a>
		</div>
	)
}

export default AnyPost
