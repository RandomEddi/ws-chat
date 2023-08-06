import {
  type FC,
  useState,
  FormEvent,
  ChangeEvent,
  useEffect,
  useRef,
} from 'react'
import {
  Button,
  useColorMode,
  Input,
  Flex,
  List,
  ListItem,
  Avatar,
  Box,
  FormLabel,
} from '@chakra-ui/react'
import { LinkIcon } from '@chakra-ui/icons'
import { wsSend } from '../ws'
import { api, colorChange } from '../utils'
import { useNotificationStore, useProfileStore } from '../store'
import { ApiResponse, User } from '../types'
import { ChatImages } from './ChatImages'

type PartialUser = Omit<User, 'token'>

export const ChatInput: FC = () => {
  const [value, setValue] = useState('')
  const [directedToList, setDirectedToList] = useState<PartialUser[]>([])
  const [isDirectedToListOpen, setIsDirectedToListOpen] =
    useState<boolean>(false)
  const [uploadedImages, setUploadedFiles] = useState<string[]>([])
  const setNotification = useNotificationStore(
    ({ setNotification }) => setNotification,
  )
  const { colorMode } = useColorMode()
  const inputRef = useRef<HTMLInputElement>(null)
  const user = useProfileStore(({ user }) => user)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleChatImageDelete = (imageUrl: string) => {
    api<ApiResponse<string>>('/delete-chat-image', {
      method: 'POST',
      body: JSON.stringify({ imageUrl }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((data) => {
      if (data.status === 'success') {
        setUploadedFiles((prev) => prev.filter((image) => image !== imageUrl))
      }
      setNotification({ message: data.payload, status: data.status })
    })
  }

  const handleChatImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files?.length > 0) {
      const files = event.target.files
      if (files.length > 5) {
        setNotification({
          status: 'error',
          message: 'Можно загружать не более 5 файлов',
        })
        return
      }
      const formData = new FormData()
      for (const file of files) {
        formData.append(Math.random().toString(), file)
      }
      formData.append('userId', user.id.toString())
      api<ApiResponse<string[]>>('/upload-chat-image', {
        method: 'POST',
        body: formData,
      }).then((data) => {
        setUploadedFiles((prev) => [...prev, ...data.payload])
      })
    }
  }

  const messageSendHandler = (event: FormEvent) => {
    event.preventDefault()
    if (value === '') return
    setValue('')
    wsSend('chat-message', {
      userId: user.id,
      text: value,
    })
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key)) {
        event.preventDefault()
      }
    }
    if (isDirectedToListOpen) {
      inputRef.current?.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      if (isDirectedToListOpen) {
        inputRef.current?.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [isDirectedToListOpen])

  const getDirectedToList = (value: string) => {
    const words = value.split(' ')

    if (value[0] === '@' && words.length === 1) {
      const name = words[0].slice(1)
      api<PartialUser[]>(`/get-users`, {
        method: 'POST',
        body: JSON.stringify({ name }),
      }).then((data) => {
        if (data.length > 0) {
          setDirectedToList(data)
          setIsDirectedToListOpen(true)
        } else {
          setDirectedToList([])
          setIsDirectedToListOpen(false)
        }
      })
    } else {
      setDirectedToList([])
      setIsDirectedToListOpen(false)
    }
  }

  const updateValue = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value
    setValue(inputValue)
    getDirectedToList(inputValue)
  }

  return (
    <form
      onSubmit={messageSendHandler}
      style={{
        width: '100%',
        height: '48px',
        position: 'relative',
      }}
    >
      {directedToList.length > 0 && isDirectedToListOpen && (
        <Box position={'absolute'} left={0} zIndex={500} bottom={'100%'}>
          <DirectedToList
            updateDirectedTo={(directedUser: PartialUser) => {
              setValue('@' + directedUser.name)
              setDirectedToList([])
              setIsDirectedToListOpen(false)
            }}
            directedToList={directedToList}
          />
        </Box>
      )}
      <Flex h={'100%'} position={'relative'}>
        <input
          style={{ display: 'none' }}
          type='file'
          id='images'
          name='images'
          onChange={handleChatImageChange}
          accept='image/png, image/jpeg'
          multiple
        />
        <FormLabel
          cursor={'pointer'}
          position={'absolute'}
          htmlFor='images'
          right={`${
            (buttonRef.current?.getBoundingClientRect().width || 0) - 12
          }px`}
          top={0}
          zIndex={100}
          display={'flex'}
          h={'48px'}
          alignItems={'center'}
          px={4}
          _hover={{
            background:
              colorMode === 'dark'
                ? 'gray.600'
                : colorMode === 'light'
                ? 'white.300'
                : colorChange(colorMode, 800),
          }}
          _active={{}}
          bgColor={
            colorMode === 'dark'
              ? 'gray.700'
              : colorMode === 'light'
              ? 'gray.200'
              : colorChange(colorMode, 700)
          }
        >
          <LinkIcon boxSize={'6'} />
        </FormLabel>
        <Input
          value={value}
          ref={inputRef}
          onChange={updateValue}
          h={'100%'}
          fontWeight={'bold'}
          fontSize={'xl'}
          border={'none'}
          borderRadius={'0'}
          size={'md'}
          onBlur={() => {
            setIsDirectedToListOpen(false)
            setDirectedToList([])
          }}
          placeholder='Введите сообщение...'
          onFocus={() => getDirectedToList(value)}
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
              ? 'gray.400'
              : colorChange(colorMode, 400)
          }
          _hover={{}}
          _focus={{
            background:
              colorMode === 'dark'
                ? 'gray.600'
                : colorMode === 'light'
                ? 'gray.100'
                : colorChange(colorMode, 600),
          }}
        />
        <ChatImages
          handleDeleteImage={handleChatImageDelete}
          images={uploadedImages}
        />
        <Button
          ref={buttonRef}
          h={'100%'}
          width={'112px'}
          _hover={{
            background:
              colorMode === 'dark'
                ? 'gray.600'
                : colorMode === 'light'
                ? 'white.300'
                : colorChange(colorMode, 800),
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

interface DirectedToListProps {
  updateDirectedTo: (user: PartialUser) => void
  directedToList: PartialUser[]
}

export const DirectedToList: FC<DirectedToListProps> = ({
  directedToList,
  updateDirectedTo,
}) => {
  const [hoveredUserIndex, setHoveredUserIndex] = useState<number>(0)
  const { colorMode } = useColorMode()

  useEffect(() => {
    setHoveredUserIndex(0)
  }, [directedToList])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        if (hoveredUserIndex + 1 === directedToList.length) {
          setHoveredUserIndex(0)
        } else {
          setHoveredUserIndex(hoveredUserIndex + 1)
        }
      }
      if (event.key === 'ArrowUp') {
        if (hoveredUserIndex - 1 === -1) {
          setHoveredUserIndex(directedToList.length - 1)
        } else {
          setHoveredUserIndex(hoveredUserIndex - 1)
        }
      }
      if (event.key === 'Enter' || event.key === 'Tab') {
        updateDirectedTo(directedToList.at(hoveredUserIndex)!)
        event.preventDefault()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [hoveredUserIndex, directedToList])

  return (
    <List
      bg={
        colorMode === 'dark'
          ? 'gray.200'
          : colorMode === 'light'
          ? 'gray.100'
          : colorChange(colorMode, 200)
      }
    >
      {directedToList.map((user, index) => {
        return (
          <ListItem
            bg={
              index === hoveredUserIndex
                ? colorMode === 'dark' || colorMode === 'light'
                  ? 'gray.500'
                  : colorChange(colorMode, 700)
                : 'inherit'
            }
            py={2}
            px={3}
            color={
              colorMode === 'dark' || colorMode === 'light'
                ? 'black'
                : undefined
            }
            cursor={'pointer'}
            onClick={() => updateDirectedTo(user)}
            onMouseEnter={() => setHoveredUserIndex(index)}
            columnGap={3}
            display={'flex'}
            alignItems={'center'}
            key={user.id}
          >
            <Avatar
              src={
                user.imageUrl
                  ? `http://localhost:3000${user.imageUrl}`
                  : undefined
              }
              size={'md'}
              name={user.name}
            />
            {user.name}
          </ListItem>
        )
      })}
    </List>
  )
}
