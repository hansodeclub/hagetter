import React from "react"

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownwardRounded"
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpwardRounded"
import DeleteIcon from "@mui/icons-material/DeleteRounded"
import EditIcon from "@mui/icons-material/EditRounded"
import IconButton from "@mui/material/IconButton"

import { ItemActionCallback } from "../PostEditor"

import { THagetterItem } from "@/stores/hagetterItem"

export const DeleteItemButton: React.FC<{
	item: THagetterItem
	onAction?: ItemActionCallback
}> = ({ item, onAction }) => {
	return (
		<IconButton
			aria-label="delete"
			onClick={() => onAction && onAction(item, { type: "delete" })}
			size="small"
			sx={{ color: "#888", border: "1px solid #aaa" }}
		>
			<DeleteIcon fontSize="small" />
		</IconButton>
	)
}

export const EditItemButton: React.FC<{
	item: THagetterItem
	onAction?: ItemActionCallback
}> = ({ item, onAction }) => {
	return (
		<IconButton
			aria-label="edit"
			onClick={() => onAction && onAction(item, { type: "edit" })}
			size="small"
			sx={{ color: "#888", border: "1px solid #aaa", backgroundColor: "white" }}
		>
			<EditIcon fontSize="small" />
		</IconButton>
	)
}

export const MoveUpItemButton: React.FC<{
	item: THagetterItem
	onAction?: ItemActionCallback
}> = ({ item, onAction }) => {
	return (
		<IconButton
			aria-label="delete"
			onClick={() => onAction && onAction(item, { type: "moveUp" })}
			size="small"
			sx={{ color: "#888", border: "1px solid #aaa" }}
		>
			<ArrowUpwardIcon fontSize="small" />
		</IconButton>
	)
}

export const MoveDownItemButton: React.FC<{
	item: THagetterItem
	onAction?: ItemActionCallback
}> = ({ item, onAction }) => {
	return (
		<IconButton
			aria-label="delete"
			onClick={() => onAction && onAction(item, { type: "moveDown" })}
			size="small"
			sx={{ color: "#888", border: "1px solid #aaa" }}
		>
			<ArrowDownwardIcon fontSize="small" />
		</IconButton>
	)
}
