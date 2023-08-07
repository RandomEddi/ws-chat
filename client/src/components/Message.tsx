import { type FC } from 'react'
import { Avatar, Box, Flex, Text, useColorMode } from '@chakra-ui/react'
import type { ChatMessage } from '../types'
import { timeConvert } from '../utils'
import { Image } from './Image'

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
          fontWeight={'normal'}
          color={colorMode === 'light' ? 'gray.400' : 'gray.100'}
        >
          {message.isMessageDirected ? (
            <>
              <b>{message.text.split(' ').at(0)} </b>
              {message.text.split(' ').slice(1).join(' ')}
            </>
          ) : (
            message.text
          )}
        </Text>
        {message.images.length > 0 && (
          <Flex px={4} py={1} gap={2}>
            {message.images.map((image) => (
              <Image key={image} imageUrl={image}></Image>
            ))}
          </Flex>
        )}
      </Box>
    </Flex>
  )
}
