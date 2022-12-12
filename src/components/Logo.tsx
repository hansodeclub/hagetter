import * as React from 'react'

import { Roboto_Condensed } from '@next/font/google'
import Link from 'next/link'

const robotoCondensedBold = Roboto_Condensed({
  weight: '700',
  subsets: ['latin'],
})

const Logo: React.FC = () => {
  return (
    <Link
      href="/"
      style={{
        textDecoration: 'none',
        color: 'black',
        fontSize: 24,
        fontWeight: 700,
      }}
      className={robotoCondensedBold.className}
    >
      Hagetter
    </Link>
  )
}

export default Logo
