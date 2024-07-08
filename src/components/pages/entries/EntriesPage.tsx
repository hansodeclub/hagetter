import React from "react"

import { useRouter } from "next/router"

import { Timestamp } from "@/components/Timestamp"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import EditIcon from "@mui/icons-material/Edit"
import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"
import Container from "@mui/material/Container"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import { amber, lightBlue } from "@mui/material/colors"

import Header from "@/components/header"

import { HagetterApiClient } from "@/lib/hagetterApiClient"

import { useSession, useStore } from "@/stores"
import { observer } from "@/stores"

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

const EntriesPage = observer(() => {
	const app = useStore()
	const session = useSession()
	const router = useRouter()

	const [loading, setLoading] = React.useState(true)
	const [invoke, setInvoke] = React.useState(false)
	const [items, setItems] = React.useState<any>()

	React.useEffect(() => {
		let unmounted = false
		if (!session.account) return
		const token = session.token
		if (!token) {
			alert("ログインしてください")
			return
		}
		setLoading(true)

		const hagetterClient = new HagetterApiClient()
		hagetterClient
			.getMyPosts(session.account.acct, token)
			.then((result) => {
				if (!unmounted) {
					setItems(result.items)
					setLoading(false)
				}
			})
			.catch((err) => {
				app.notifyError(err)
				setLoading(false)
			})
		return () => {
			unmounted = true
		}
	}, [session.account, invoke])

	const onDeletePost = (id: string) => {
		if (!session.token) return
		if (window.confirm("削除しますか?")) {
			const hagetterClient = new HagetterApiClient()
			hagetterClient
				.deletePost(id, session.token)
				.then((_) => {
					setInvoke(!invoke)
				})
				.catch(app.notifyError)
		}
	}

	return (
		<div>
			<Header />
			<Container sx={{ padding: { xs: 1, md: 2 } }}>
				<h2>投稿の管理</h2>
				{loading && <CircularProgress sx={{ margin: 3 }} />}
				{!loading && (
					<div>
						<Box sx={{ maxWidth: 640, borderTop: "1px solid #ccc" }}>
							{!loading &&
								items &&
								items.map((item) => (
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
															<span className="text-base text-gray-500">
																更新)
															</span>
														</>
													)}
												</Box>
											</Box>
										</Box>
										<Box
											sx={{
												flexBasis: 100,
												flexGrow: 0,
												alignItems: "center",
												justifyContent: "center",
											}}
										>
											<IconButton
												sx={{ mr: 2 }}
												onClick={() => router.push(`/edit/${item.id}`)}
											>
												<EditIcon />
											</IconButton>
											<IconButton onClick={() => onDeletePost(item.id)}>
												<DeleteOutlineIcon />
											</IconButton>
										</Box>
									</Box>
								))}
						</Box>
					</div>
				)}
			</Container>
		</div>
	)
})

export default EntriesPage
