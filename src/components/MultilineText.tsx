import React from 'react'

export const MultilineText = ({ text }) => {
  const texts = text.split(/(\n)/).map((item, index) => {
    return (
      <React.Fragment key={index}>
        {item.match(/\n/) ? <br /> : item}
      </React.Fragment>
    )
  })
  return <>{texts}</>
}

export default MultilineText
