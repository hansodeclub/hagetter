import React from 'react'
import { THagetterItem } from '@/stores/hagetterItem'
import { observer } from 'mobx-react-lite'
import Toot from '../Toot/Toot'
import { Status } from '@/entities/Status'
import { TextSize } from '@/entities/HagetterPost'
import Typography from '@mui/material/Typography'
import { SxProps, Theme } from '@mui/material/styles'

const styles: { [key: string]: SxProps<Theme> } = {
  toot: {
    borderBottom: '1px solid #cccccc',
  },
}

interface TextItemProps {
  text: string
  variant: TextSize
  color: string
  selected?: boolean
  onClick?: () => any
}

const MultilineText = ({ text }) => {
  const texts = text.split(/(\n)/).map((item, index) => {
    return (
      <React.Fragment key={index}>
        {item.match(/\n/) ? <br /> : item}
      </React.Fragment>
    )
  })
  return <>{texts}</>
}

export const TextItem: React.FC<TextItemProps> = ({
  text,
  variant,
  color,
  selected,
  onClick,
}) => (
  <li style={{ display: 'inline', padding: 0, margin: 0 }}>
    <Typography
      variant={variant}
      onClick={() => onClick()}
      sx={{
        margin: 0,
        padding: '5px 10px',
        backgroundColor: selected ? '#ffeeee' : '#ffffff',
        color: color,
      }}
    >
      <MultilineText text={text} />
    </Typography>
  </li>
)

const Item = observer(
  ({
    item,
    onClick,
    preferOriginal,
  }: {
    item: THagetterItem
    onClick: (item: THagetterItem) => boolean
    preferOriginal?: boolean
  }) => {
    if (item.type === 'status') {
      const status: Status = item.data as Status
      return (
        <li style={{ display: 'inline' }}>
          <Toot
            variant={item.size}
            color={item.color}
            onClick={() => onClick(item)}
            selected={item.selected}
            status={status}
            sx={styles.toot}
            preferOriginal={preferOriginal}
          />
        </li>
      )
    } else if (item.type === 'text') {
      const textItem: any = item.data // TODO: Add type guard
      return (
        <TextItem
          text={textItem.text}
          variant={item.size}
          color={item.color}
          selected={item.selected}
          onClick={() => onClick(item)}
        />
      )
    } else {
      throw Error(`Unknown item type: ${item.type}`)
    }
  }
)

export default Item
