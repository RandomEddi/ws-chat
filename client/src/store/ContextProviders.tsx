import { ReactNode } from 'react'
import { SnowProvider } from './snow-context'

export const ContextProviders = ({ children }: { children: ReactNode }) => {
  return <SnowProvider>{children}</SnowProvider>
}
