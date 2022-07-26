import * as React from 'react'
import Head from 'next/head'
import sanitizeHtml from 'sanitize-html'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import useMediaQuery from '@mui/material/useMediaQuery'
import Hidden from '@mui/material/Hidden'
import Header from '@/components/Header'
import { SxProps, Theme } from '@mui/material/styles'
import { fromJson, JsonString, toJson } from '@/utils/serializer'
import { HagetterPostInfo } from '@/entities/HagetterPost'
import { GetServerSideProps, NextPage } from 'next'
import Box from '@mui/material/Box'
import { getHitString, search } from '@/utils/search/algolia'
import head from '@/utils/head'

const styles: { [key: string]: SxProps<Theme> } = {
  container: {
    margin: 1,
  },
  keyword: {
    paddingBottom: 2,
  },
  hitItem: {
    '& em': {
      fontWeight: 'bold',
    },
    paddingBottom: 2,
  },
}

interface PageProps {
  keyword: string
  items: JsonString<HitItem>
  hits: number
  page: number | null
  pages: number | null
  error: string | null
}

interface HitItem {
  hid: string
  title: string
  description: string
  created_at: string
  highlight: string
}

const processItem = (hit: any): HitItem => {
  const sanitizer = (text) =>
    sanitizeHtml(text, {
      allowedTags: ['em'],
    })
  return {
    hid: hit.objectID,
    title: sanitizer(hit.title),
    description: sanitizer(hit.description),
    created_at: hit.created_at,
    highlight: getHitString(hit) || '',
  }
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  try {
    const keyword = head(context.query.q)

    if (!keyword) {
      return {
        props: {
          keyword: '',
          hits: 0,
          items: [],
          error: null,
          page: null,
          pages: null,
        },
      }
    }

    const { hits, nbHits, page, nbPages } = await search(keyword)

    return {
      props: {
        keyword,
        hits: nbHits,
        items: toJson(hits.map(processItem)),
        page: page,
        pages: nbPages,
        error: null,
      },
    }
  } catch (err) {
    console.log(err)
    return {
      props: {
        keyword: '',
        hits: 0,
        items: [],
        page: null,
        pages: null,
        error: err.message,
      },
    }
  }
}

interface Props {
  recentPosts: HagetterPostInfo[]
}

const Item: React.FC<{ item: HitItem }> = ({ item }) => {
  return (
    <Box sx={styles.hitItem}>
      <a href={`/hi/${item.hid}`}>
        <span
          dangerouslySetInnerHTML={{
            __html: item.title,
          }}
        />
      </a>
      <Box>
        <span dangerouslySetInnerHTML={{ __html: item.highlight }} />
      </Box>
    </Box>
  )
}

const SearchPage: NextPage<PageProps> = (props) => {
  const items: HitItem[] = fromJson(props.items)

  return (
    <div>
      <Head>
        <title>Hagetter - 検索結果：{props.keyword}</title>
      </Head>
      <Header />
      <Box sx={styles.container}>
        {items.map((item) => (
          <Item item={item} key={item.hid} />
        ))}
      </Box>
    </div>
  )
}

export default SearchPage
