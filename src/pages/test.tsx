import Link from 'next/link'
import { NextPage } from 'next'
import useMediaQuery from '@mui/material/useMediaQuery'
import { fromJson } from '@/utils/serializer'
import { QueryResult } from '@/entities/api/QueryResult'
import { HagetterPostInfo } from '@/entities/HagetterPost'
import Head from 'next/head'
import Header from '@/components/Header'
import * as React from 'react'

const TestPage: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Hagetter</title>
      </Head>
      <Header />

      <Link href="/hi/2359385096944269">hi</Link>
    </div>
  )
}

export default TestPage
