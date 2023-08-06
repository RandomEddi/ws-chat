import { Flex } from '@chakra-ui/react'
import { type FC } from 'react'
import { Image } from './Image'

interface Props {
  images: string[]
  handleDeleteImage: (imageUrl: string) => void
}

export const ChatImages: FC<Props> = ({ handleDeleteImage, images }) => {
  if (images.length === 0) return <></>
  return (
    <Flex
      p={2}
      gap={2}
      flexWrap={'wrap'}
      position={'absolute'}
      zIndex={400}
      left={0}
      right={0}
      bottom={'100%'}
      bg={'whiteAlpha.600'}
    >
      {images.map((imageUrl) => (
        <Image
          handleDeleteImage={handleDeleteImage}
          key={imageUrl}
          imageUrl={imageUrl}
        />
      ))}
    </Flex>
  )
}
