import { Messages, ChatInput, ThemeSettings } from './components'
import { Flex } from '@chakra-ui/react'

function App() {
  return (
    <>
      <Flex>
        <Messages />
        <ChatInput />
      </Flex>
      <ThemeSettings />
    </>
  )
}

export default App
