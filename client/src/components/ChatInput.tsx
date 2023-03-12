import { FC, useState, FormEvent } from 'react'
import { Button, Grid, GridItem } from '@chakra-ui/react'
import { Input } from '.'
import { wsSend } from '../ws'

export const ChatInput: FC = () => {
  const [value, setValue] = useState('')

  const messageSendHandler = (e: FormEvent) => {
    if (value === '') return
    e.preventDefault()
    setValue('')
    wsSend('chat-message', value)
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
            onChange={(e) => setValue(e.target.value)}
            h={'100%'}
            _focus={{
              borderColor: 'purple.800',
              background: 'gray.100',
              color: 'purple.800'
            }}
            _placeholder={{ color: 'purple.700' }}
            color='purple.700'
            fontWeight={'bold'}
            fontSize={'xl'}
            borderColor={'purple.700'}
            borderRadius={'0'}
            size={'md'}
            focusBorderColor={'#153e75'}
            placeholder='Введите сообщение...'
          />
        </GridItem>
        <GridItem>
          <Button
            h={'100%'}
            _hover={{ background: 'purple.800' }}
            _active={{ background: 'purple.900' }}
            bgColor={'purple.700'}
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
