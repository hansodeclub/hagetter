import { observer } from "mobx-react-lite"
import Link from "next/link"
import React from "react"

import Logo from "@/components/logo"
import { Button } from "@/components/ui/button"
import { useScrollState } from "@/hooks/use-scroll-state"
import { cn } from "@/lib/utils"
import { useSession } from "@/stores"
import { UserMenu } from "./user-menu"

export const Header: React.FC = observer(() => {
	const session = useSession()
	const scrollState = useScrollState()

	return (
		<div className="sticky top-0 right-0 z-50 h-16">
			<div
				className={cn(
					"flex h-full w-full items-center space-x-2 border-b bg-white px-4 transition-transform",
					scrollState === "scrolling-down" && "-translate-y-16 transform",
				)}
			>
				<div className="flex-1">
					<Logo />
				</div>
				<div className="flex-1 grow" />
				{!session.loading && !session.account && (
					<Button asChild>
						<Link href="/login">ログイン</Link>
					</Button>
				)}
				{!session.loading && session.account && (
					<>
						<Button asChild variant="default">
							<Link href="/edit">まとめを作る</Link>
						</Button>
						<UserMenu
							avatar={session.account.avatar}
							displayName={
								session.account.displayName || session.account.username
							}
							acct={session.account.acct}
							onLogout={session.logout}
						/>
					</>
				)}
			</div>
		</div>
	)
})

export default Header
