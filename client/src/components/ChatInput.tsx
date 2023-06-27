import { type FC, useState, FormEvent } from 'react'
import { Button, Grid, GridItem, useColorMode, Input } from '@chakra-ui/react'
import { wsSend } from '../ws'
import { colorChange } from '../utils'
import {  useProfileStore } from '../store'

export const ChatInput: FC = () => {
  const [value, setValue] = useState('')
  const { colorMode } = useColorMode()
  const user = useProfileStore(({ user }) => user)

  const messageSendHandler = (event: FormEvent) => {
    if (value === '') return
    event.preventDefault()
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
        position: 'fixed',
        bottom: '0',
        overflow: 'hidden',
        width: '100%',
        height: '48px'
      }}
    >
      <Grid h={'100%'} templateColumns='1fr 112px'>
        <GridItem>
          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            h={'100%'}
            _focus={{
              borderColor: colorChange(colorMode, 800),
              background: 'gray.100',
              color: colorChange(colorMode, 800)
            }}
            _placeholder={{ color: colorMode }}
            color={colorMode}
            fontWeight={'bold'}
            fontSize={'xl'}
            borderColor={colorMode}
            borderRadius={'0'}
            size={'md'}
            focusBorderColor={'#153e75'}
            placeholder='Введите сообщение...'
          />
        </GridItem>
        <GridItem>
          <Button
            h={'100%'}
            _hover={{ background: colorChange(colorMode, 800) }}
            _active={{ background: colorChange(colorMode, 900) }}
            bgColor={colorMode}
            border={'none'}
            borderRadius={'0'}
            w={'112px'}
            colorScheme={'blue'}
            type='submit'
          >
            Отправить
          </Button>
        </GridItem>
      </Grid>
    </form>
  )
}
