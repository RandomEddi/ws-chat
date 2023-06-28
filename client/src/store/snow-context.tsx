import {
  createContext,
  ReactNode,
  useContext,
  useLayoutEffect,
  useState
} from 'react'
import type { ColorResult, RGBColor } from 'react-color'

type SnowSpeedType = [number, number]

interface SnowContext {
  isEnabled: boolean
  onSnowToggle: (bool: boolean) => void
  color: RGBColor
  onColorSnowChange: (color: ColorResult) => void
  speed: SnowSpeedType
  onSpeedSnowChange: (firstSpeed?: number, secondSpeed?: number) => void
}

const snowContext = createContext<SnowContext | null>(null)

export const useSnowContext = () => {
  const data = useContext(snowContext)

  if (!data) {
    throw new Error('Can not `useAppContext` outside of the `AppProvider`')
  }

  return data
}

export const SnowProvider = ({ children }: { children: ReactNode }) => {
  const [color, setColor] = useState<RGBColor>({ r: 255, g: 255, b: 255, a: 1 })
  const [speed, setSpeed] = useState<SnowSpeedType>([1.0, 3.0])
  const [isEnabled, setIsEnabled] = useState<boolean>(true)

  useLayoutEffect(() => {
    const storageSnowColor = localStorage.getItem('snow-color')
    if (storageSnowColor) {
      setColor(JSON.parse(storageSnowColor))
    }

    const storageSnowSpeed = localStorage.getItem('snow-speed')
    if (storageSnowSpeed) {
      setSpeed(JSON.parse(storageSnowSpeed))
    }

    const storageSnowIsEnabled = localStorage.getItem('snow-is-enabled')
    if (storageSnowIsEnabled) {
      setIsEnabled(!!JSON.parse(storageSnowIsEnabled))
    }
  }, [])

  const onColorSnowChange = (color: ColorResult) => {
    setColor(color.rgb)
    localStorage.setItem('snow-color', JSON.stringify(color.rgb))
  }

  const onSpeedSnowChange = (firstSpeed?: number, secondSpeed?: number) => {
    setSpeed((prevSpeed) => {
      let speed = [
        firstSpeed ? firstSpeed : prevSpeed[0],
        secondSpeed ? secondSpeed : prevSpeed[1]
      ]
      localStorage.setItem('snow-speed', JSON.stringify(speed))
      return speed as SnowSpeedType
    })
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
        speed,
        onSpeedSnowChange,
        onColorSnowChange
      }}
    >
      {children}
    </snowContext.Provider>
  )
}
