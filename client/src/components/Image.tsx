import { useState, type FC } from 'react'
import { Box, Flex, Image as ImageChakra } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import { ImageModal } from './ImageModal'

interface Props {
  imageUrl: string
  handleDeleteImage?: (imageUrl: string) => void
}

export const Image: FC<Props> = ({ imageUrl, handleDeleteImage }) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false)

  return (
    <>
      <Box
        cursor={'pointer'}
        onClick={() => setIsImageModalOpen(true)}
        bg={'white'}
        position={'relative'}
      >
        {handleDeleteImage && (
          <Flex
            bg={'red'}
            cursor={'pointer'}
            onClick={(event) => {
              event.stopPropagation()
              handleDeleteImage(imageUrl)
            }}
            alignItems={'center'}
            justifyContent={'center'}
            borderRadius={'full'}
            h={6}
            w={6}
            position={'absolute'}
            top={-2}
            right={-2}
          >
            <CloseIcon boxSize={'3'} />
          </Flex>
        )}
        <ImageChakra
          h={'32'}
          maxW={'80'}
          objectFit={'contain'}
          alt={'chat image'}
          key={imageUrl}
          src={'http://localhost:3000' + imageUrl}
        />
      </Box>
      {isImageModalOpen && (
        <ImageModal
          imageUrl={imageUrl}
          onCloseModal={() => setIsImageModalOpen(false)}
        />
      )}
    </>
  )
}
