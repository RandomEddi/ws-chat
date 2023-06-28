import { type FC, useState, FormEvent } from 'react'
import { Button, useColorMode, Input, Flex } from '@chakra-ui/react'
import { wsSend } from '../ws'
import { colorChange } from '../utils'
import { useProfileStore } from '../store'

export const ChatInput: FC = () => {
  const [value, setValue] = useState('')
  const { colorMode } = useColorMode()
  const user = useProfileStore(({ user }) => user)

  const messageSendHandler = (event: FormEvent) => {
    event.preventDefault()
    if (value === '') return
    setValue('')
    wsSend('chat-message', {
      userId: user.id,
      text: value
    })
  }

  return (
    <form
      onSubmit={messageSendHandler}
      style={{
        overflow: 'hidden',
        width: '100%',
        height: '48px'
      }}
    >
      <Flex h={'100%'}>
        <Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          h={'100%'}
          fontWeight={'bold'}
          fontSize={'xl'}
          border={'none'}
          borderRadius={'0'}
          size={'md'}
          placeholder='Введите сообщение...'
          bgColor={
            colorMode === 'dark'
              ? 'gray.700'
              : colorMode === 'light'
              ? 'gray.200'
              : colorChange(colorMode, 700)
          }
          color={
            colorMode === 'dark'
              ? 'gray.400'
              : colorMode === 'light'
              ? 'gray.100'
              : colorChange(colorMode, 400)
          }
          _hover={{}}
          _focus={{
            background:
              colorMode === 'dark'
                ? 'gray.600'
                : colorMode === 'light'
                ? 'gray.100'
                : colorChange(colorMode, 600)
          }}
        />
        <Button
          h={'100%'}
          width={'112px'}
          _hover={{
            background:
              colorMode === 'dark'
                ? 'gray.600'
                : colorMode === 'light'
                ? 'white.300'
                : colorChange(colorMode, 800)
          }}
          _active={{}}
          bgColor={
            colorMode === 'dark'
              ? 'gray.700'
              : colorMode === 'light'
              ? 'gray.200'
              : colorChange(colorMode, 700)
          }
          border={'none'}
          borderRadius={'0'}
          w={'112px'}
          color={colorMode === 'light' ? 'black' : 'white'}
          type='submit'
        >
          Отправить
        </Button>
      </Flex>
    </form>
  )
}
