import { Instance, types } from "mobx-state-tree"

import {
	type HagetterItem as HagetterItemType,
	type TextSize,
	isColorable,
	isSizeable,
} from "@/entities/post"

export const EditorItem = types
	.model("ItemBase", {
		sortKey: types.number,
		selected: types.optional(types.boolean, false),
		editMode: types.optional(types.boolean, false),
		showMenu: types.optional(types.boolean, false),
		data: types.frozen<HagetterItemType>(),
	})
	.actions((self) => ({
		setSelected(selected: boolean) {
			self.selected = selected
		},
		toggleSelected() {
			self.selected = !self.selected
		},
		setShowMenu(showMenu: boolean) {
			self.showMenu = showMenu
		},
		setEditMode(editMode: boolean) {
			self.editMode = editMode
		},
		setFormat(size?: TextSize, color?: string) {
			if (size && color && isColorable(self.data) && isSizeable(self.data)) {
				self.data = { ...self.data, size, color }
			} else if (isColorable(self.data) && color) {
				self.data = { ...self.data, color }
			} else if (isSizeable(self.data) && size) {
				self.data = { ...self.data, size }
			}
		},
		setSize(size: TextSize) {
			if (isSizeable(self.data)) {
				self.data = { ...self.data, size }
			}
		},
		setColor(color: string, color2?: string) {
			if (isColorable(self.data)) {
				self.data = { ...self.data, color, color2 }
			}
		},
		setText(text: string) {
			if (self.data.type === "text") {
				self.data.data = { text }
			}
		},
	}))
	.views((self) => ({
		get id(): string {
			return self.data.id
		},
		get type(): string {
			return self.data.type
		},
		get isPrivateStatus(): boolean {
			return (
				self.data.type === "status" &&
				["private", "direct"].includes(self.data.data.visibility)
			)
		},
		get canSetText(): boolean {
			return ["text", "markdown"].includes(self.data.type)
		},
		get canChangeSize(): boolean {
			return isSizeable(self.data)
		},
		get canChangeColor(): boolean {
			return isColorable(self.data)
		},
		get size(): TextSize | undefined {
			if (isSizeable(self.data)) {
				return self.data.size
			}
			return undefined
		},
		get color(): string | undefined {
			if (isColorable(self.data)) {
				return self.data.color
			}
			return undefined
		},
		get color2(): string | undefined {
			if (isColorable(self.data)) {
				return self.data.color2
			}
			return undefined
		},
	}))

export interface EditorItemType extends Instance<typeof EditorItem> {}
