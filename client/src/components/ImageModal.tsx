import { CloseIcon } from '@chakra-ui/icons'
import { Box, Flex, Image } from '@chakra-ui/react'
import { type FC, useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { clamp } from '../utils'

interface Props {
  onCloseModal: () => void
  imageUrl: string
}

const MAX_SCALE = 3
const MIN_SCALE = 0.8
const SCALING_FACTOR = 0.1

export const ImageModal: FC<Props> = ({ imageUrl, onCloseModal }) => {
  const [scale, setScale] = useState<number>(1)
  const imageRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      const direction = event.deltaY < 0 ? 'up' : 'down'
      const unclampedNewScale =
        direction === 'up' ? scale + SCALING_FACTOR : scale - SCALING_FACTOR
      const newScale = clamp(unclampedNewScale, MIN_SCALE, MAX_SCALE)

      setScale(newScale)
    }

    imageRef.current?.addEventListener('wheel', handleWheel)
    return () => {
      imageRef.current?.removeEventListener('wheel', handleWheel)
    }
  }, [scale])

  return createPortal(
    <Flex
      onClick={onCloseModal}
      justifyContent={'center'}
      alignItems={'center'}
      position={'fixed'}
      zIndex={700}
      inset={0}
      maxW={'80wv'}
      bg={'rgba(0, 0, 0, 0.8)'}
    >
      <Box
        transform={`scale(${scale})`}
        ref={imageRef}
        transition={'transform 0.3s'}
        onClick={(event) => event.stopPropagation()}
      >
        <Image
          maxW={'80vw'}
          alt={'image'}
          objectFit={'contain'}
          key={imageUrl}
          src={'http://localhost:3000' + imageUrl}
        />
      </Box>
    </Flex>,
    document.querySelector('#modal')!,
  )
}
