import { FC } from 'react'
import { FormControl, Button, Grid, GridItem } from '@chakra-ui/react'
import { Input } from '.'

export const ChatInput: FC = () => {
  return (
    <FormControl position={'fixed'} bottom='0'>
      <Grid templateColumns='1fr 112px'>
        <GridItem>
          <Input
            borderColor={'purple.800'}
            borderRadius={'0'}
            size={'md'}
            focusBorderColor={'#153e75'}
            placeholder='Введите сообщение...'
          />
        </GridItem>
        <GridItem>
          <Button
            bgColor={'purple.800'}
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
