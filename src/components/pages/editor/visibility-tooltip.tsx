import React from "react"

export interface VisibilityTooltipProps
	extends React.HTMLAttributes<HTMLDivElement> {
	username?: string
}

export const VisibilityTooltip: React.FC<VisibilityTooltipProps> = ({
	username,
}) => {
	const userPostsLink = username ? (
		<a
			href={`/${username}`}
			target="_blank"
			rel="noreferrer"
			className="underline decoration-dotted"
		>
			ユーザー投稿一覧
		</a>
	) : (
		"ユーザー投稿一覧"
	)

	return (
		<div className="p-2 text-sm">
			<div>
				記事の公開範囲がより細かく設定可能になりました。(以前の「未収載」は「限定公開」に変更されました。)
			</div>
			<h3 className="mt-2 font-bold">公開</h3>
			<div>トップページの新着と{userPostsLink}に表示されます。</div>
			<h3 className="mt-2 font-bold">未収載</h3>
			<div>
				トップページの新着には表示されません。{userPostsLink}には表示されます。
			</div>
			<h3 className="mt-3 font-bold">限定公開</h3>
			<div>
				トップページの新着と{userPostsLink}
				には表示されません。ただし、記事のURLを知っている人は誰でもアクセス出来ます。
			</div>
			<h3 className="mt-3 font-bold">下書き</h3>
			<div>本人以外はアクセス出来ません。</div>
		</div>
	)
}
