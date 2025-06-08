import dayjs from "dayjs"
import { describe, expect, it } from "vitest"

import { Status } from "@/entities/status"
import { EditorStore } from "@/stores/editor-store"

describe("EditorStore", () => {
	it("should create an instance", () => {
		const editorStore = EditorStore.create()
		expect(editorStore).toBeDefined()
	})

	it("should set sortKey properly", () => {
		const isoDate = "2024-01-01T00:00:00.000Z"
		const expectedSortKey = dayjs(isoDate).valueOf()
		const dummyStatus = {
			id: "123",
			createdAt: isoDate,
		} as Status

		const editorStore = EditorStore.create()

		// Statusを追加してその手前にテキストを2つ挿入する
		editorStore.addStatus(dummyStatus)
		editorStore.addText("text", "123", "inherit", "#000000", "#000000", "text")
		editorStore.addText(
			"text2",
			"123",
			"inherit",
			"#000000",
			"#000000",
			"text2",
		)

		expect(editorStore.items.length).toBe(3)
		expect(editorStore.items[0].id).toBe("text")
		expect(editorStore.items[1].id).toBe("text2")
		expect(editorStore.items[2].id).toBe("123")

		expect(editorStore.items[2].sortKey).toBe(expectedSortKey)
		expect(editorStore.items[1].sortKey).toBe(expectedSortKey - 1)
		expect(editorStore.items[0].sortKey).toBe(expectedSortKey - 1)
	})
})
