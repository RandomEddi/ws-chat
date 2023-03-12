import { FC } from 'react'
import { Text } from '@chakra-ui/react'

interface Props {
  text: string
}

export const Message: FC<Props> = ({ text }) => {
  return <Text fontSize={'2xl'} fontWeight={'semibold'} color={'gray.100'}>{text}</Text>
}
