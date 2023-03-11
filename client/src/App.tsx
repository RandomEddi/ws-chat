import { wsSend, wsConnection } from './ws'
import { useState } from 'react'
import { Messages, ChatInput } from './components'
import { Flex } from '@chakra-ui/react'

function App() {
  const [value, setValue] = useState('')
  const [messages, setMessages] = useState<string[]>([])

  const onMessageSend = () => {
    wsSend('chat-message', value)
  }

  wsConnection.onmessage = (message) => {
    if (!message.data.includes('{')) return
    const data = JSON.parse(message.data)

    if (data.event === 'chat-message') {
      const payload = data.payload as string
      setMessages((prev) => [payload, ...prev])
    }
  }
  return (
    <Flex>
      <Messages messages={messages} />
      <ChatInput />
    </Flex>
  )
}

export default App
