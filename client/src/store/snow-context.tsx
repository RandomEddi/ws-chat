import {
  createContext,
  ReactNode,
  useContext,
  useLayoutEffect,
  useState
} from 'react'
import { Color, ColorResult } from 'react-color'

interface ISnowContext {
  isEnabled: boolean
  onSnowToggle: (bool: boolean) => void
  color: Color
  onColorSnowChange: (color: ColorResult) => void
}

const snowContext = createContext<ISnowContext | null>(null)

export const useSnowContext = () => {
  const data = useContext(snowContext)

  if (!data) {
    throw new Error('Can not `useAppContext` outside of the `AppProvider`')
  }

  return data
}

export const SnowProvider = ({ children }: { children: ReactNode }) => {
  const [color, setColor] = useState<Color>({ r: 255, g: 255, b: 255, a: 1 })
  const [isEnabled, setIsEnabled] = useState<boolean>(true)

  useLayoutEffect(() => {
    const storageSnowColor = localStorage.getItem('snow-color')
    if (!storageSnowColor) return
    setColor(JSON.parse(storageSnowColor))
    const storageSnowIsEnabled = localStorage.getItem('snow-is-enabled')
    if (!storageSnowIsEnabled) return
    setIsEnabled(!!JSON.parse(storageSnowIsEnabled))
  }, [])

  const onColorSnowChange = (color: ColorResult) => {
    setColor(color.rgb)
    localStorage.setItem('snow-color', JSON.stringify(color.rgb))
  }

  const onSnowToggle = (bool: boolean) => {
    setIsEnabled(bool)
    localStorage.setItem('snow-is-enabled', JSON.stringify(bool))
  }

  return (
    <snowContext.Provider
      value={{
        isEnabled,
        onSnowToggle,
        color,
        onColorSnowChange
      }}
    >
      {children}
    </snowContext.Provider>
  )
}
