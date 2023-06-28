import { type FC } from 'react'
import { Avatar, Box, Flex, Text, useColorMode } from '@chakra-ui/react'
import type { ChatMessage } from '../types'
import { timeConvert } from '../utils'

interface Props {
  message: ChatMessage
  isSameMessage: boolean
}

export const Message: FC<Props> = ({ message, isSameMessage }) => {
  const { colorMode } = useColorMode()

  return (
    <Flex>
      {!isSameMessage && (
        <Box>
          <Avatar
            boxShadow={'base'}
            src={
              message.senderImg
                ? `http://localhost:3000${message.senderImg}`
                : undefined
            }
            name={message.senderName}
          />
        </Box>
      )}
      <Box>
        {!isSameMessage && (
          <Box display={'inline-flex'} px={'3'} columnGap={'10px'}>
            <Text color={'black'} fontWeight={'bold'} fontSize={'xl'}>
              {message.senderName}
            </Text>
            <Text fontSize={'xl'}>{timeConvert(message.sendAt)}</Text>
          </Box>
        )}
        <Text
          pl={isSameMessage ? '16' : '4'}
          fontSize={'2xl'}
          fontWeight={'semibold'}
          color={colorMode === 'light' ? 'gray.400' : 'gray.100'}
        >
          {message.text}
        </Text>
      </Box>
    </Flex>
  )
}
