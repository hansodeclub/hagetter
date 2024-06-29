import React from "react"

import moment from "moment-timezone"

export interface TimestampProps extends React.HTMLAttributes<HTMLSpanElement> {
	value: string
	showSeconds?: boolean
}

const Timestamp: React.FC<TimestampProps> = ({
	value,
	showSeconds = true,
	...rest
}) => {
	const date = moment(value).tz("Asia/Tokyo")

	return (
		<span {...rest}>
			{date.format(`YYYY-MM-DD HH:mm${showSeconds ? ":ss" : ""}`)}
		</span>
	)
}

export default Timestamp
