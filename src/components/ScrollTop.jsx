import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    const timerId = setTimeout(() => window.scrollTo(0, 0), 200)
    return () => {
      clearTimeout(timerId)
    }
  }, [pathname])

  return null
}
