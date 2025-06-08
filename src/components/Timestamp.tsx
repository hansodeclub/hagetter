import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import React from "react"

dayjs.extend(timezone)
dayjs.extend(utc)

export const getTimestamp = (value: string, showSeconds = true) => {
	const jtc = dayjs(value).tz("Asia/Tokyo")
	return jtc.format(`YYYY-MM-DD HH:mm${showSeconds ? ":ss" : ""}`)
}

export interface TimestampProps extends React.HTMLAttributes<HTMLSpanElement> {
	value: string
	showSeconds?: boolean
}

export const Timestamp: React.FC<TimestampProps> = ({
	value,
	showSeconds = true,
	...rest
}) => {
	return <span {...rest}>{getTimestamp(value, showSeconds)}</span>
}

export interface JapaneseDateProps
	extends React.HTMLAttributes<HTMLSpanElement> {
	showTime?: boolean
	value: string
}

export const JapaneseDate: React.FC<TimestampProps> = ({ value, ...rest }) => {
	return <span {...rest}>{getJapaneseDate(value)}</span>
}

export const getJapaneseDate = (value: string, showTime = false) => {
	const jtc = dayjs(value).tz("Asia/Tokyo")
	return jtc.format(`YYYY年MM月DD日${showTime ? " HH時mm分" : ""}`)
}

export default Timestamp
