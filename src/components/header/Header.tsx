"use client"

import * as React from "react"

import { observer } from "mobx-react-lite"
import { Roboto_Condensed } from "next/font/google"
import Link from "next/link"

import type { SxProps } from "@mui/material"
import AppBar from "@mui/material/AppBar"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Popover from "@mui/material/Popover"
import Slide from "@mui/material/Slide"
import Toolbar from "@mui/material/Toolbar"
import type { Theme } from "@mui/material/styles"
import useScrollTrigger from "@mui/material/useScrollTrigger"

import Logo from "@/components/Logo"
import UserMenu from "@/components/header/UserMenu"

import { useSession } from "@/stores"

const robotoCondensedBold = Roboto_Condensed({
	weight: "700",
	subsets: ["latin"],
})

const styles: { [key: string]: SxProps<Theme> } = {
	appbar: {
		color: "#000000",
		backgroundColor: (theme: Theme) => theme.header.light,
		borderBottom: "1px solid #aaa",
	},
	toolbar: {
		justifyContent: "space-between",
	},

	/* Left side of AppBar */
	left: {
		flex: 1,
	},
	title: {
		fontSize: 24,
		//fontFamily: "'Roboto Condensed', sans-serif",
		fontWeight: 700,
		//textTransform: 'uppercase',
	},
	a: {
		textDecoration: "none",
		color: "black",
		fontSize: 24,
		//fontFamily: "'Roboto Condensed', sans-serif",
		fontWeight: 700,
	},

	/* Right side of AppBar */
	right: {
		//flex: 1,
		//display: 'flex',
		justifyContent: "flex-end",
		alignItems: "center",
	},
	username: {
		marginRight: 5,
	},
	matomeButton: {
		marginRight: 2,
	},
	menuButton: {
		marginRight: 2,
	},
}

const Header: React.FC = observer(() => {
	const trigger = useScrollTrigger({})
	const session = useSession()
	const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget)
	}

	const handleClose = () => {
		setAnchorEl(null)
	}

	const showPop = Boolean(anchorEl)

	return (
		<>
			<Slide appear={false} in={!trigger}>
				<AppBar sx={styles.appbar} elevation={0}>
					<Toolbar sx={styles.toolbar}>
						<Box sx={styles.left}>
							<Logo />
						</Box>
						<Box sx={styles.right}>
							{!session.loading && !session.account && (
								<Link href="/login">
									<Button>ログイン</Button>
								</Link>
							)}
							{!session.loading && session.account && (
								<>
									<Link href="/edit/beta">
										<Button
											variant="contained"
											color="primary"
											sx={styles.matomeButton}
											disableElevation
										>
											まとめを作る
										</Button>
									</Link>

									<IconButton
										onClick={handleClick}
										disableFocusRipple={true}
										disableRipple={true}
										style={{ backgroundColor: "transparent", padding: 0 }}
									>
										<Avatar src={session.account.avatar} />
									</IconButton>

									<Popover
										open={showPop}
										anchorEl={anchorEl}
										onClose={handleClose}
										anchorOrigin={{
											vertical: "bottom",
											horizontal: "center",
										}}
										transformOrigin={{
											vertical: "top",
											horizontal: "center",
										}}
									>
										<UserMenu
											displayName={session.account.displayName}
											acct={session.account.acct}
											onLogout={session.logout}
										/>
									</Popover>
								</>
							)}
						</Box>
					</Toolbar>
				</AppBar>
			</Slide>
			<Toolbar />
		</>
	)
})

export default Header
