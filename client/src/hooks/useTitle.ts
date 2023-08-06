import { useEffect, useState } from 'react'

export const useTitle = (initialTitle?: string) => {
  const [title, setTitle] = useState(initialTitle || document.title)

  useEffect(() => {
    document.title = title
  }, [title])

  const updateTitle = (newTitle: string) => {
    setTitle(newTitle)
  }

  return {
    title,
    updateTitle
  }
}
