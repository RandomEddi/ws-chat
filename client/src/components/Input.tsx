import { FC } from 'react'
import { Input as CUIInput, InputProps } from '@chakra-ui/react'

export const Input: FC<InputProps> = (props) => {
  return <CUIInput variant={'filled'} type={'text'} {...props} />
}
