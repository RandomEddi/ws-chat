import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ChakraProvider } from '@chakra-ui/react'
import { ContextProviders } from './store'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ContextProviders>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </ContextProviders>
  </React.StrictMode>
)
