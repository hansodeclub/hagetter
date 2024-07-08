import React from "react"

import Box from "@mui/material/Box"

import Container from "@mui/material/Container"

import Typography from "@mui/material/Typography"
import { amber, lightBlue } from "@mui/material/colors"

import Header from "@/components/header"

import { Timestamp } from "@/components/Timestamp"
import { HagetterPostInfo } from "@/features/posts/types"

const Label = ({
	children,
	onClick = () => {},
	bgColor,
	color,
}: {
	children: React.ReactNode
	onClick?: () => void
	bgColor: string
	color: string
}) => {
	return (
		<Typography
			sx={{
				display: "inline-block",
				fontSize: "0.8rem",
				width: 80,
				backgroundColor: bgColor,
				color: color,
				borderRadius: 3,
				textAlign: "center",
				fontWeight: "bold",
				padding: "0.1rem",
			}}
			onClick={onClick}
		>
			{children}
		</Typography>
	)
}

export interface UserEntriesPageProps {
	username: string
	posts: HagetterPostInfo[]
}

const UserEntriesPage: React.FC<UserEntriesPageProps> = ({
	username,
	posts,
}) => {
	return (
		<div>
			<Header />
			<Container sx={{ padding: { xs: 1, md: 2 } }}>
				<h2>{username}の投稿</h2>
				<div>
					<Box sx={{ maxWidth: 640, borderTop: "1px solid #ccc" }}>
						{posts.map((item) => (
							<Box
								sx={{
									display: "flex",
									width: "100%",
									pt: 2,
									pb: 2,
									borderBottom: "1px solid #ccc",
								}}
							>
								<Box sx={{ flexGrow: 1 }}>
									<Box
										sx={{
											fontWeight: "bold",
											color: "#000",
											fontSize: "large",
											mb: 1,
										}}
									>
										<a
											href={`/hi/${item.id}`}
											style={{ color: "#000" }}
											target="_blank"
											rel="noreferrer"
										>
											{item.title}
										</a>
									</Box>
									<Box sx={{ display: "flex" }}>
										{item.visibility === "unlisted" && (
											<Label bgColor={amber[800]} color="white">
												未収載
											</Label>
										)}
										{item.visibility === "public" && (
											<Label bgColor={lightBlue[600]} color="white">
												公開
											</Label>
										)}
										<Box sx={{ ml: 2 }}>
											<Timestamp
												value={item.createdAt}
												className="text-base text-gray-500"
												showSeconds={true}
											/>
											{item.updatedAt && (
												<>
													<span className="text-base text-gray-500">
														{" ("}
													</span>
													<Timestamp
														value={item.createdAt}
														className="text-base text-gray-500"
														showSeconds={true}
													/>{" "}
													<span className="text-base text-gray-500">更新)</span>
												</>
											)}
										</Box>
									</Box>
								</Box>
							</Box>
						))}
					</Box>
				</div>
			</Container>
		</div>
	)
}

export default UserEntriesPage
