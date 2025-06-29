import { Spinner } from "@/components/spinner"
import { observer } from "mobx-react-lite"
import { useRouter, useParams } from "next/navigation"
import React from "react"

import Logo from "@/components/logo"
import { useDocumentRect } from "@/hooks/use-document-height"
import { usePageLeaveConfirmation } from "@/hooks/use-page-leave-confirmation"
import { HagetterApiClient } from "@/lib/hagetterApiClient"
import { useEditor, useSession, useStore } from "@/stores"
import { BottomBar } from "./bottom-bar"
import { MultiSelectMenu } from "./menus/multi-select-menu"
import { PostEditor, leftColumnWidth } from "./post-editor"
import { SidePanel } from "./side-panel"

const EditPage: React.FC<{ create?: boolean }> = observer(({ create }) => {
	const router = useRouter()
	const params = useParams()
	const [loading, setLoading] = React.useState(true)
	const [code, setCode] = React.useState<number>()
	const [error, setError] = React.useState<string>()
	const [submitting, setSubmitting] = React.useState(false)
	const app = useStore()
	const editor = useEditor()
	const session = useSession()

	const editAreaRef = React.useRef<HTMLDivElement>(null)
	const sidePanelRef = React.useRef<HTMLDivElement>(null)
	const [overlapped, setOverlapped] = React.useState<boolean>()
	const [showTimeline, setShowTimeline] = React.useState<boolean>()

	const { width, height } = useDocumentRect()

	const isMobile = typeof width !== "undefined" && width < 768 //!useMediaQuery("(min-width:768px)") // md = 768px
	const isTablet = typeof width !== "undefined" && width < 1024 //!useMediaQuery("(min-width:1024px)") // lg = 1024px
	const foldSidePanel =
		(showTimeline === undefined && overlapped) || showTimeline === false

	usePageLeaveConfirmation(!editor.editing || submitting)

	React.useEffect(() => {
		const editAreaRightX = editAreaRef.current?.getBoundingClientRect().right
		const sidePanelLeftX = sidePanelRef.current?.getBoundingClientRect().left
		if (editAreaRightX && sidePanelLeftX) {
			setOverlapped(editAreaRightX > sidePanelLeftX)
		}
	}, [width])

	const hid = params.hid as string
	React.useEffect(() => {
		if (create) {
			editor.clear()
			setCode(200)
			setLoading(false)
			return
		}
		let unmounted = false

		if (!hid) return
		if (!session.loading && !session.loggedIn) {
			setError("ログインしていません")
		}

		const hagetterClient = new HagetterApiClient()
		hagetterClient
			.getVerifiablePost(hid, session.token!)
			.then((data) => {
				if (!unmounted) {
					editor.clear()
					editor.setId(hid)
					editor.setTitle(data.title)
					editor.setDescription(data.description)
					editor.bulkAdd(data.contents)
					editor.setVisibility(data.visibility as any)
					setCode(200)
					setLoading(false)
				}
			})
			.catch((err) => {
				console.error(err)
				setCode(500)
				setLoading(false)
			})
		return () => {
			unmounted = true
		}
	}, [hid, session.loading])

	const onSubmit = async () => {
		if (submitting) return
		if (!editor.title || !editor.description) {
			alert("タイトル、説明は必須入力です")
			setSubmitting(false)
			return
		}

		if (!session.loggedIn || !session.token) {
			console.error("Not logged in")
			alert("ログインしていないようです")
			setSubmitting(false)
			return
		}

		setSubmitting(true)

		const hagetterClient = new HagetterApiClient()
		try {
			const key = await hagetterClient.createPost(
				session.token,
				editor.title,
				editor.description,
				editor.visibility,
				editor.itemsSnapshot,
				editor.hid,
			)

			setSubmitting(false)
			router.push(`/hi/${key}`)
		} catch (err) {
			app.notifyError(err)
			setSubmitting(false)
		}
	}

	if (error) {
		return <p>{error}</p>
	}
	if (code === 404) {
		return <p>Not found</p>
	}

	return (
		<div className="mb-20">
			<div className="mx-2 my-1 flex items-center">
				<Logo />
			</div>

			<div
				className="mt-1 mr-14 mb-80 ml-0 border-0 bg-white p-2 sm:border sm:shadow md:mr-7 md:ml-1"
				style={{
					maxWidth: 632 + leftColumnWidth,
				}}
				ref={editAreaRef}
			>
				{loading && <Spinner />}
				{!loading && code === 200 && <PostEditor isMobile={isMobile} />}
			</div>
			<SidePanel
				invisible={foldSidePanel}
				toggleInvisible={() =>
					setShowTimeline(showTimeline === undefined ? false : !showTimeline)
				}
				isTablet={isTablet}
				ref={sidePanelRef}
			/>
			<MultiSelectMenu
				isMobile={isMobile}
				color={editor.selectedItemsFormat.color}
				size={editor.selectedItemsFormat.size}
			/>
			<BottomBar onSubmit={onSubmit} submitting={submitting} className="z-20" />
		</div>
	)
})

export default EditPage
