import ReactDOM from 'react-dom/client'
import { App } from './App'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { SnowProvider } from './store'
import './index.css'

const theme = extendTheme({
  config: { initialColorMode: 'system', useSystemColorMode: false }
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <SnowProvider>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </SnowProvider>
)
