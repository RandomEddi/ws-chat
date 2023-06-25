import { FC } from 'react'
import { Avatar, Box, Flex, Text } from '@chakra-ui/react'
import { IMessage } from '../types'
import { timeConvert } from '../utils'

interface Props {
  message: IMessage
  isSameMessage: boolean
}

export const Message: FC<Props> = ({ message, isSameMessage }) => {
  return (
    <Flex>
      {!isSameMessage && (
        <Box>
          <Avatar name={message.senderName} />
        </Box>
      )}
      <Box>
        {!isSameMessage && (
          <Box display={'inline-flex'} px={'3'} columnGap={'10px'}>
            <Text fontWeight={'bold'} fontSize={'xl'}>
              {message.senderName}
            </Text>
            <Text fontSize={'xl'}>{timeConvert(message.sendAt)}</Text>
          </Box>
        )}
        <Text
          pl={isSameMessage ? '16' : '4'}
          fontSize={'2xl'}
          fontWeight={'semibold'}
          color={'gray.100'}
        >
          {message.text}
        </Text>
      </Box>
    </Flex>
  )
}
