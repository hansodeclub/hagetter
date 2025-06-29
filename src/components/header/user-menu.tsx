"use client"

import { FileText as FileTextIcon, LogOut as LogOutIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import React from "react"

import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UserMenuProps {
	avatar: string
	displayName: string
	acct: string
	onLogout?: () => void
}

export const UserMenu: React.FC<UserMenuProps> = ({
	displayName,
	acct,
	avatar,
	onLogout = () => {},
}) => {
	const router = useRouter()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					<Avatar>
						<AvatarImage src={avatar} alt="" />
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>
					<a href={`/${acct}`}>
						<div>
							<div>{displayName}</div>
							<div className="font-normal">{acct}</div>
						</div>
					</a>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => router.push("/entries")}>
					<FileTextIcon className="mr-2 h-4 w-4" />
					<span>投稿の管理</span>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => onLogout()}>
					<LogOutIcon className="mr-2 h-4 w-4" />
					<span>ログアウト</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
