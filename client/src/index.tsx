import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { ContextProviders } from './store'
import './index.css'

const theme = extendTheme({
  initialColorMode: 'purple.700',
  useSystemColorMode: false
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ContextProviders>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </ContextProviders>
  </React.StrictMode>
)
