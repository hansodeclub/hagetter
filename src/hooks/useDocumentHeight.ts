import { useCallback, useEffect, useState } from 'react'

export const useDocumentHeight = () => {
  const getHeight = useCallback(
    () =>
      window.visualViewport ? window.visualViewport.height : window.innerHeight,
    []
  )
  const [height, setHeight] = useState<string>('100vh')

  useEffect(() => {
    const handleResize = (e: Event) => {
      setHeight(`${getHeight()}px`)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)
    window.visualViewport?.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
      window.visualViewport?.removeEventListener('resize', handleResize)
    }
  }, [getHeight])

  return height
}

export default useDocumentHeight
