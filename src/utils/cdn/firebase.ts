import { NextApiRequest } from 'next'
import getHost from '@/utils/getHost'

export const purgeCache = async (
  req: NextApiRequest,
  hid: string,
  purgeHome: boolean = true
) => {
  const baseUrl = `${getHost(req)}`
  if (purgeHome) {
    try {
      await fetch(baseUrl, { method: 'PURGE' })
      try {
        console.log(
          `${baseUrl}/_next/data/${process.env.NEXT_BUILD_ID}/index.json`
        )
        await fetch(
          `${baseUrl}/_next/data/${process.env.NEXT_BUILD_ID}/index.json`,
          { method: 'PURGE' }
        )
      } catch (err) {
        console.error(err)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const url = `${getHost(req)}/hi/${hid}`
  try {
    await fetch(url, { method: 'PURGE' })
    await fetch(
      `${baseUrl}/_next/data/${process.env.NEXT_BUILD_ID}/hi/${hid}.json`,
      { method: 'PURGE' }
    )
  } catch (err) {
    console.error(err)
  }
}
