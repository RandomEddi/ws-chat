import { FC, useState } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import { Message, SnowBackground } from '.'
import { wsConnection } from '../ws'

export const Messages: FC = () => {
  const [messages, setMessages] = useState<string[]>([])

  wsConnection.onmessage = (message) => {
    const data = JSON.parse(message.data)
    if (data.event === 'chat-message') {
      setMessages(data.payload as string[])
    }
  }

  return (
    <Flex
      flexDirection={'column-reverse'}
      bgColor={'purple.400'}
      w={'100%'}
      h={'calc(100vh - 48px)'}
      position={'relative'}
    >
      <SnowBackground />
      <Box px={'4'} w={'100%'} overflow={'auto'}>
        {messages.map((m) => (
          <Message text={m} key={Math.random()} />
        ))}
      </Box>
    </Flex>
  )
}
