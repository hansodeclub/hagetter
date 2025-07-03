import { EditPage } from "@/components/pages/editor"

interface PageProps {
	params: Promise<{ hid: string }>
}

export default async function Page({ params }: PageProps) {
	const { hid } = await params
	return <EditPage hid={hid} />
}
