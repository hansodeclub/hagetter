import type * as React from "react"

import { useRouter } from "next/router"

import SearchIcon from "@mui/icons-material/Search"
import IconButton from "@mui/material/IconButton"
import InputBase from "@mui/material/InputBase"
import Paper from "@mui/material/Paper"
import type { SxProps, Theme } from "@mui/material/styles"

import TextField from "@mui/material/TextField"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"

export interface SearchBoxProps {
	sx?: SxProps<Theme>
}

const SearchField: React.FC<SearchBoxProps> = ({ sx }) => (
	<Paper
		elevation={0}
		sx={[
			{ p: "2px 4px", display: "flex", alignItems: "center", width: 300 },
			...(Array.isArray(sx) ? sx : [sx]),
		]}
	>
		<InputBase
			sx={{ ml: 1, flex: 1 }}
			placeholder="検索"
			inputProps={{ "aria-label": "search google maps" }}
		/>
	</Paper>
)

const SearchBox: React.FC<SearchBoxProps> = ({ sx }) => {
	const router = useRouter()
	const { control, handleSubmit } = useForm<{ q: string }>()

	const onSubmit: SubmitHandler<{ q: string }> = (data) => {
		router.push("/search?q=" + data.q)
	}

	return (
		<form method="GET" action="search" onSubmit={handleSubmit(onSubmit)}>
			<Controller
				name="q"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						sx={[
							{ backgroundColor: "white" },
							...(Array.isArray(sx) ? sx : [sx]),
						]}
						InputProps={{
							endAdornment: (
								<IconButton
									type="submit"
									sx={{ p: "10px" }}
									aria-label="search"
								>
									<SearchIcon />
								</IconButton>
							),
						}}
					/>
				)}
			/>
		</form>
	)
}

export default SearchBox
