import React from "react"

import TButton from "@mui/icons-material/Title"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import { GithubPicker } from "react-color"

import { TextSize, isTextSize } from "@/entities/post"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import { SxProps, Theme } from "@mui/material/styles"

const styles: { [key: string]: SxProps<Theme> } = {
	color: {
		width: "36px",
		height: "14px",
		borderRadius: "2px",
	},
	swatch: {
		padding: "5px",
		background: "#fff",
		borderRadius: "1px",
		boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
		display: "inline-block",
		cursor: "pointer",
	},
	popover: {
		position: "absolute",
		zIndex: 2,
	},
	cover: {
		position: "fixed",
		top: "0px",
		right: "0px",
		bottom: "0px",
		left: "0px",
	},
}

const colors = [
	"#B80000",
	"#DB3E00",
	"#FCCB00",
	"#008B02",
	"#006B76",
	"#1273DE",
	"#004DCF",
	"#5300EB",
	"#EB9694",
	"#FAD0C3",
	"#FEF3BD",
	"#C1E1C5",
	"#BEDADC",
	"#C4DEF6",
	"#BED3F3",
	"#D4C4FB",
	"#000000",
	"#ff0000",
	"#00ff00",
	"#0000ff",
	"#ffffff",
]

export interface TextFormatSelectorProps {
	size: string | false
	color: string | false
	onSizeChange: (size: TextSize) => void
	onColorChange: (color: string) => void
}

const TextFormatSelector: React.FC<TextFormatSelectorProps> = ({
	size,
	color,
	onSizeChange,
	onColorChange,
}) => {
	const [showPicker, setShowPicker] = React.useState(false)
	const handleSizeChange = (event, newSize) => {
		if (!isTextSize(newSize)) {
			throw Error("Invalid text size")
		}

		onSizeChange(newSize)
	}

	const handleColorChange = (newColor) => {
		setShowPicker(false)
		if (color !== newColor) {
			onColorChange(newColor.hex)
		}
	}

	return (
		<Grid container spacing={1} alignItems="center">
			<Grid item>
				<ToggleButtonGroup
					size="small"
					value={size}
					exclusive
					onChange={handleSizeChange}
				>
					<ToggleButton key={1} value="h3">
						<TButton style={{ fontSize: 30 }} />
					</ToggleButton>
					<ToggleButton key={2} value="h6">
						<TButton style={{ fontSize: 24 }} />
					</ToggleButton>
					<ToggleButton key={3} value="body2">
						<TButton style={{ fontSize: 18 }} />
					</ToggleButton>
				</ToggleButtonGroup>
			</Grid>
			<Grid item>
				<Box sx={styles.swatch} onClick={() => setShowPicker(!showPicker)}>
					<Box
						sx={styles.color}
						style={{ backgroundColor: color || "black" }}
					/>
				</Box>
				{showPicker ? (
					<Box sx={styles.popover}>
						<Box sx={styles.cover} onClick={handleColorChange} />
						<GithubPicker
							colors={colors}
							color={color}
							onChange={handleColorChange}
						/>
					</Box>
				) : null}
			</Grid>
		</Grid>
	)
}

export default TextFormatSelector
