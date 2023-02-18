import { useArgs } from '@storybook/client-api'
import { ComponentStory } from '@storybook/react'

import TextFormatter from './TextFormatter'

export default {
  title: 'TextFormatter',
  component: TextFormatter,
}

const Template: ComponentStory<typeof TextFormatter> = (args) => {
  const [{ onChange }, updateArgs] = useArgs()
  const handleChange = (newArgs) => {
    if (newArgs.color) {
      updateArgs({ color: newArgs.color })
    } else if (newArgs.size) {
      updateArgs({ size: newArgs.size })
    }

    onChange(newArgs)
  }

  return (
    <div style={{ padding: 20, paddingBottom: 0, backgroundColor: '#ffffff' }}>
      <TextFormatter {...args} onChange={handleChange} />
    </div>
  )
}

export const Default = Template.bind({})
Default.args = {
  text: '1個のアイテムを選択中',
  size: 'h3',
  color: '#EB9694',
}
