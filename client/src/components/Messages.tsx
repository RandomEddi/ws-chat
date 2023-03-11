import { FC } from 'react'
import { Box } from '@chakra-ui/react'
import Snowfall from 'react-snowfall'
import { Message } from '.'

export const Messages: FC<{ messages: string[] }> = ({ messages }) => {
  return (
    <Box bgColor={'purple.400'} w={'100%'} h={'100vh'} position={'relative'}>
      <Snowfall color='white' />
      <Box>
        {messages.map((m) => (
          <Message text={m} key={Math.random()} />
        ))}
      </Box>
    </Box>
  )
}
