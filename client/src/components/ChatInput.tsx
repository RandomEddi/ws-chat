import { FC } from 'react'
import { FormControl, Button, Grid, GridItem } from '@chakra-ui/react'
import { Input } from '.'

export const ChatInput: FC = () => {
  return (
    <FormControl position={'fixed'} bottom='0'>
      <Grid templateColumns='1fr 112px'>
        <GridItem>
          <Input
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
            _hover={{ background: 'purple.800' }}
            _active={{ background: 'purple.900' }}
            bgColor={'purple.700'}
            borderRadius={'0'}
            w={'112px'}
            colorScheme={'blue'}
            type='submit'
          >
            Отправить
          </Button>
        </GridItem>
      </Grid>
    </FormControl>
  )
}
