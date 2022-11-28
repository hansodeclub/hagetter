import React from 'react'

import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'

import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Hidden from '@mui/material/Hidden'
import { SxProps, Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import BorderedBox from '@/components/BorderedBox'
import Header from '@/components/Header'
import SearchBox from '@/components/SearchBox'
import RecentPosts from '@/components/widgets/RecentPosts'

import { HagetterPostInfo } from '@/core/domains/post/HagetterPost'
import { PostFirestoreRepository } from '@/core/infrastructure/server-firestore/PostFirestoreRepository'

import { QueryResult } from '@/lib/api/QueryResult'
import { sendCacheControl } from '@/lib/cdn/cloudflare'
import { JsonString, fromJson, toJson } from '@/lib/serializer'

const styles: { [key: string]: SxProps<Theme> } = {
  container: {
    paddingTop: 1,
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
    const postRepository = new PostFirestoreRepository()
    const recentPosts = await postRepository.queryPosts({
      limit: 300,
      visibility: 'public',
    })

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

const PC = ({ recentPosts }: Props) => {
  const [logo, setLogo] = React.useState('/donmi_kusa_semai.png')
  React.useEffect(() => {
    console.log(window.location.hash)
    if (window.location.hash === '#donmi') {
      setLogo('/donmi2.jpg')
    }
  }, [])
  return (
    <Container sx={styles.container}>
      <Grid container spacing={2}>
        <Hidden xsDown>
          <Grid item>
            <BorderedBox style={{ flexGrow: 1, maxWidth: 300 }}>
              <img src={logo} style={{ width: '100%', display: 'block' }} />
            </BorderedBox>
            <SearchBox
              sx={{ marginTop: 1, border: '1px solid #ccc', width: 300 }}
            />
          </Grid>
        </Hidden>
        <Grid item>
          <BorderedBox style={{ minWidth: 300, flexShrink: 0 }}>
            <RecentPosts posts={recentPosts} />
          </BorderedBox>
        </Grid>
      </Grid>
    </Container>
  )
}

const Mobile = ({ recentPosts }: Props) => (
  <div style={{ borderBottom: '1px solid #888' }}>
    <SearchBox
      sx={{
        padding: 1,
        border: '1px solid #ccc',
        width: '100%',
        maxWidth: '667px',
      }}
    />
    <RecentPosts posts={recentPosts} />
  </div>
)

const Home: NextPage<PageProps> = (props) => {
  const wideMonitor = useMediaQuery('(min-width:667px)')
  const recentPosts = fromJson<QueryResult<HagetterPostInfo>>(props.recentPosts)

  return (
    <div>
      <Head>
        <title>Hagetter</title>
      </Head>
      <Header />

      {wideMonitor && <PC recentPosts={recentPosts.items} />}
      {!wideMonitor && <Mobile recentPosts={recentPosts.items} />}
    </div>
  )
}

export default Home
