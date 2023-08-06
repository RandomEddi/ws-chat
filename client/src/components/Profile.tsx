import { ChangeEvent, type FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import {
  Box,
  Avatar,
  Button,
  Flex,
  useColorMode,
  Text,
  FormLabel,
} from '@chakra-ui/react'
import { wsConnection } from '../ws'
import { useProfileStore, useNotificationStore } from '../store'
import { api, colorChange } from '../utils'

export const Profile: FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [_, __, deleteCookies] = useCookies()
  const [isAvatarHovered, setIsAvatarHovered] = useState(false)
  const setNotification = useNotificationStore(({ setNotification }) => (setNotification))
  const user = useProfileStore(({ user }) => user)
  const navigate = useNavigate()
  const { colorMode } = useColorMode()
  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files?.length > 0) {
      const file = event.target.files[0]
      // wsConnection.send(file)
      const formData = new FormData()

      formData.append('file', file)
      formData.append('userId', user.id.toString())
      api('/change-avatar', {
        method: 'POST',
        body: formData,
      }).then((data) => {
        setNotification({ status: data.status, message: data.payload })
      })
    }
  }

  const handleLogout = () => {
    deleteCookies('token')
    navigate('/login')
  }
  
  return (
    <>
      <Box cursor={'pointer'} onClick={() => setIsOpen(true)}>
        <Avatar
          boxShadow={'base'}
          src={`http://localhost:3000${user.imageUrl}`}
          name={user.name}
        />
      </Box>
      {isOpen && (
        <Flex
          bgColor={'rgba(0, 0, 0, 0.3)'}
          onClick={() => setIsOpen(false)}
          position={'fixed'}
          inset={0}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Flex
            flexDirection={'column'}
            alignItems={'center'}
            onClick={(event) => event.stopPropagation()}
            py={'32'}
            px={'80'}
            borderRadius={10}
            bgColor={
              colorMode === 'dark'
                ? 'blackAlpha.600'
                : colorMode === 'light'
                ? 'whiteAlpha.600'
                : colorChange(colorMode, 800)
            }
          >
            <Flex flexDirection={'column'} alignItems={'center'} mb={'40'}>
              <Box
                onMouseEnter={() => setIsAvatarHovered(true)}
                onMouseLeave={() => setIsAvatarHovered(false)}
              >
                {isAvatarHovered ? (
                  <>
                    <input
                      style={{ display: 'none' }}
                      type='file'
                      id='image'
                      name='image'
                      accept='image/png, image/jpeg'
                      onChange={handleAvatarChange}
                    />
                    <FormLabel
                      cursor={'pointer'}
                      display={'flex'}
                      justifyContent={'center'}
                      alignItems={'center'}
                      width={'32'}
                      height={'32'}
                      color={'black'}
                      backgroundColor={'white'}
                      borderRadius={'full'}
                      htmlFor='image'
                      p={'0'}
                      m={'0'}
                    >
                      Сменить фото
                    </FormLabel>
                  </>
                ) : (
                  <Avatar
                    src={`http://localhost:3000${user.imageUrl}`}
                    size={'2xl'}
                    name={user.name}
                  />
                )}
              </Box>
              <Text
                color={colorChange(colorMode, 100)}
                fontWeight={'bold'}
                fontSize={'5xl'}
              >
                {user.name}
              </Text>
            </Flex>
            <Button fontSize={'2xl'} px={'10'} py={'7'} onClick={handleLogout}>
              Выйти
            </Button>
          </Flex>
        </Flex>
      )}
    </>
  )
}
