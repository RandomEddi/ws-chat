import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState
} from 'react'
import { Color } from 'react-color'

interface ISnowContext {
  isEnabled: boolean
  setIsEnabled: Dispatch<SetStateAction<boolean>>
  color: Color
  setColor: Dispatch<SetStateAction<Color>>
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

  return (
    <snowContext.Provider
      value={{
        isEnabled,
        setIsEnabled,
        color,
        setColor
      }}
    >
      {children}
    </snowContext.Provider>
  )
}
