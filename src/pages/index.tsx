import React from 'react'

import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Hidden from '@mui/material/Hidden'
import { SxProps, Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import BorderedBox from '@/components/BorderedBox'
import Header from '@/components/Header'
import SearchBox from '@/components/SearchBox'
import RecentPosts from '@/components/widgets/RecentPosts'

import { getRecentPublicPost } from '@/features/posts/api'
import { HagetterPostInfo } from '@/features/posts/types'
import { sendCacheControl } from '@/lib/cdn/cloudflare'
import { JsonString, fromJson, toJson } from '@/lib/utils/serializer'
import { QueryResult } from '@/types/api'

const styles: { [key: string]: SxProps<Theme> } = {
  container: {
    paddingTop: 1,
    px: { xs: 0, md: 4 },
    backgroundColor: '#fff',
  },
  gridContainer: {
    height: '100vh',
    overflow: 'hidden',
    paddingTop: 1,
    boxSizing: 'border-box',
  },
  gridColumn: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
}

interface PageProps {
  code: number
  recentPosts: JsonString<QueryResult<HagetterPostInfo>> | null
  error: string | null
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  try {
    const recentPosts = await getRecentPublicPost({ limit: 300 })

    sendCacheControl(context.res)

    return {
      props: {
        code: 200,
        recentPosts: toJson(recentPosts),
        error: null,
      },
    }
  } catch (err) {
    console.log(err)
    return {
      props: {
        code: err.code ?? 500,
        recentPosts: null,
        error: err.message,
      },
    }
  }
}

interface Props {
  recentPosts: HagetterPostInfo[]
}

const Content = ({ recentPosts }: Props) => {
  const [logo, setLogo] = React.useState('/images/donmi_kusa_semai.png')
  React.useEffect(() => {
    if (window.location.hash === '#donmi') {
      setLogo('/images/donmi2.jpg')
    }
  }, [])
  return (
    <Container sx={styles.container}>
      <Box sx={{ display: { xs: 'block', md: 'flex' } }}>
        <Box>
          <Hidden mdDown>
            <BorderedBox
              style={{
                flexGrow: 1,
                maxWidth: 300,
                marginRight: '16px',
              }}
            >
              <img src={logo} style={{ width: '100%', display: 'block' }} />
            </BorderedBox>
          </Hidden>
          <SearchBox
            sx={{
              px: { xs: 1, md: 0 },
              my: 1,
              width: { xs: '100%', md: '300px' },
            }}
          />
        </Box>
        <Box
          sx={{
            minWidth: 300,
            flexShrink: 0,
            border: { md: '1px solid #ccc' },
          }}
        >
          <RecentPosts posts={recentPosts} />
        </Box>
      </Box>
    </Container>
  )
}

const Home: NextPage<PageProps> = (props) => {
  const recentPosts = fromJson<QueryResult<HagetterPostInfo>>(props.recentPosts)

  return (
    <div>
      <Head>
        <title>Hagetter</title>
      </Head>
      <Header />

      <Content recentPosts={recentPosts.items} />
    </div>
  )
}

export default Home
