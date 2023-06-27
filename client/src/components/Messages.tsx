import { type FC, useEffect, useRef } from 'react'
import { Box, Flex, useColorMode } from '@chakra-ui/react'
import { colorChange } from '../utils'
import { useMessagesStore } from '../store'
import type { ChatMessage } from '../types'
import { Message, SnowBackground } from '.'

export const Messages: FC = () => {
  const { messages } = useMessagesStore(({ messages }) => ({
    messages
  }))
  const { colorMode } = useColorMode()
  const messagesDivRef = useRef<HTMLDivElement | null>(null)
  const lastMessage = useRef<null | ChatMessage>(null)

  useEffect(() => {
    lastMessage.current = null
    if (messagesDivRef.current) {
      messagesDivRef.current.scrollTo({
        top: messagesDivRef.current.scrollHeight
      })
    }
  }, [messages])

  return (
    <Flex
      flexDirection={'column-reverse'}
      bgColor={colorChange(colorMode, 400)}
      w={'100%'}
      h={'calc(100vh - 48px)'}
      position={'relative'}
    >
      <SnowBackground />
      <Box
        ref={messagesDivRef}
        px={'4'}
        pb={'2'}
        maxH={'calc(100% - 44px - 1rem)'}
        overflow={'auto'}
        sx={{
          '&::-webkit-scrollbar': {
            background: colorChange(colorMode, 100),
            borderRadius: '10px'
          },
          '&::-webkit-scrollbar-track': {
            width: '4px'
          },
          '&::-webkit-scrollbar-thumb': {
            background: colorChange(colorMode, 700),
            borderRadius: '10px',
            my: '3px'
          }
        }}
      >
        {messages.map((message) => {
          let isSameUserMessage = false
          if (lastMessage.current?.senderName === message.senderName) {
            const lastMessageDate = new Date(lastMessage.current?.sendAt)
            const messageDate = new Date(message.sendAt)
            if (
              lastMessageDate.getFullYear() === messageDate.getFullYear() &&
              lastMessageDate.getMonth() === messageDate.getMonth() &&
              lastMessageDate.getDate() === messageDate.getDate() &&
              lastMessageDate.getHours() === messageDate.getHours() &&
              lastMessageDate.getMinutes() === messageDate.getMinutes()
            ) {
              isSameUserMessage = true
            }
          }

          lastMessage.current = message
          return (
            <Message
              message={message}
              key={Math.random()}
              isSameMessage={isSameUserMessage}
            />
          )
        })}
      </Box>
    </Flex>
  )
}
