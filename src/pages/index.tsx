import * as React from 'react'
import Head from 'next/head'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import useMediaQuery from '@mui/material/useMediaQuery'
import Hidden from '@mui/material/Hidden'
import Header from '@/components/Header'
import MatomeList from '@/components/matome/MatomeList'
import BorderedBox from '@/components/BorderedBox'
import { SxProps, Theme } from '@mui/material/styles'
import { fromJson, JsonString, toJson } from '@/utils/serializer'
import { HagetterPost, HagetterPostInfo } from '@/entities/HagetterPost'
import { GetServerSideProps, NextPage } from 'next'
import head from '@/utils/head'
import { PostFirestoreRepository } from '@/infrastructure/firestore/PostFirestoreRepository'
import { QueryResult } from '@/entities/api/QueryResult'
import RecentPosts from '@/components/widgets/RecentPosts'

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
    const recentPosts = await postRepository.queryPosts({ limit: 300 })
    context.res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=600')

    return {
      props: {
        code: 200,
        recentPosts: toJson(recentPosts),
        error: null,
      },
    }
  } catch (err) {
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
  return (
    <Container sx={styles.container}>
      <Grid container spacing={2}>
        <Hidden xsDown>
          <Grid item>
            <BorderedBox style={{ flexGrow: 1, maxWidth: 300 }}>
              <img src="/donmi_kusa_semai.png" style={{ width: '100%' }} />
            </BorderedBox>
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
    <RecentPosts posts={recentPosts} />
  </div>
)

const Home: NextPage<PageProps> = (props) => {
  const wideMonitor = useMediaQuery('(min-width:667px)')
  //const wideMonitor = useMediaQuery(theme => theme.breakpoints.up('sm'));

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
