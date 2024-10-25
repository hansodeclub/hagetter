import React from "react"

import { observer } from "mobx-react-lite"

import ErrorIcon from "@mui/icons-material/Error"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Snackbar from "@mui/material/Snackbar"
import SnackbarContent from "@mui/material/SnackbarContent"
import { amber } from "@mui/material/colors"
import { SxProps, Theme } from "@mui/material/styles"

import { HagetterApiClient } from "@/lib/hagetterApiClient"

import { useStore } from "@/stores"

const styles: { [key: string]: SxProps<Theme> } = {
	warning: {
		backgroundColor: amber[700],
	},
	icon: {
		fontSize: 20,
	},
	iconVariant: {
		opacity: 0.9,
		marginRight: 1,
	},
	message: {
		display: "flex",
		alignItems: "center",
	},
}

const sendError = async (error: Error) => {
	let url
	try {
		const hagetterClient = new HagetterApiClient()
		const errorId = hagetterClient.postError(
			window.location.href,
			error.message,
			error.stack ? error.stack.split("\n") : [],
		)
		url = `${window.location.origin}/errors/${errorId}`
	} catch (err) {}

	window.open(
		`https://handon.club/share?text=${encodeURIComponent(
			`@osa9 バグってるぞ殺すぞ\nERROR: ${error.message}${url && "\n" + url}`,
		)}`,
	)
}

const Action: React.FC<{ error: Error }> = ({ error }) => (
	<Button color="primary" size="small" onClick={() => sendError(error)}>
		報告する
	</Button>
)

export const ErrorNotification = observer(() => {
	const rootStore = useStore()
	const [open, setOpen] = React.useState(false)
	React.useEffect(() => {
		if (rootStore.error) {
			setOpen(true)
		}
	}, [rootStore.error])
	if (!rootStore.error) return null
	return (
		<Snackbar
			anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
			open={open}
			autoHideDuration={6000}
			onClose={() => setOpen(false)}
			ContentProps={{
				"aria-describedby": "message-id",
			}}
		>
			<SnackbarContent
				sx={styles.warning}
				message={
					<Box id="message-id" sx={styles.message}>
						<ErrorIcon />
						{rootStore.error.message}
					</Box>
				}
				action={<Action error={rootStore.error} />}
			/>
		</Snackbar>
	)
})

export default ErrorNotification
