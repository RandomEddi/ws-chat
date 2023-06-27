import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text
} from '@chakra-ui/react'
import Fireworks from '@fireworks-js/react'
import { FC, useEffect, useState } from 'react'
import { useProfileStore } from '../store'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'

export const Login: FC = () => {
  const [isLoginActive, setIsLoginActive] = useState(false)
  const [nameValue, setNameValue] = useState<string>('')
  const [nameError, setNameError] = useState<string | null>(null)
  const [passwordValue, setPasswordValue] = useState<string>('')
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const navigate = useNavigate()
  const [cookies, setCookies] = useCookies(['token'])
  const setUser = useProfileStore(({ setUser }) => setUser)

  useEffect(() => {
    setNameError(null)
    setPasswordError(null)
  }, [isLoginActive])

  useEffect(() => {
    if (cookies.token) {
      navigate('/chat')
    }
  }, [])

  const registrationHandler = async () => {
    if (passwordValue.length < 8) {
      setPasswordError('Пароль должен быть 8 или больше символов')
      return
    }
    fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: nameValue,
        password: passwordValue
      })
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.status === 'success') {
          setCookies('token', data.payload.token)
          setUser(data.payload)
          navigate('/chat')
        } else {
          if (data.payload.error === 'name') {
            setNameError(data.payload.text)
          }
        }
      })
  }

  const loginHandler = async () => {
    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: nameValue,
        password: passwordValue
      })
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.status === 'success') {
          setCookies('token', data.payload.token)
          setUser(data.payload)
          navigate('/chat')
        } else {
          if (data.payload.error === 'name') {
            setNameError(data.payload.text)
          } else if (data.payload.error === 'password') {
            setPasswordError(data.payload.text)
          }
        }
      })
  }

  return (
    <>
      <Flex
        alignItems={'center'}
        justifyContent={'center'}
        bgColor={'blue.900'}
        w={'100%'}
        minH={'100vh'}
        position={'relative'}
      >
        <form
          style={{
            borderRadius: '10px',
            padding: '15px 25px 20px 25px',
            margin: '0 80px',
            maxWidth: '600px',
            backgroundColor: '#FAF5FF',

            zIndex: 150,
            width: '100%',
            position: 'relative'
          }}
        >
          <Text mb={7} fontSize={20} textAlign={'center'} fontWeight={'bold'}>
            {isLoginActive ? 'Логин' : 'Регистрация'}
          </Text>
          <Box>
            <FormLabel htmlFor='user'>Имя пользователя</FormLabel>
            <Input
              onChange={(e) => setNameValue(e.target.value)}
              onFocus={() => setNameError(null)}
              value={nameValue}
              sx={{
                _hover: {
                  borderColor: nameError ? 'red' : 'black',
                  borderWidth: 1
                },
                _focus: {},
                _focusVisible: {
                  borderColor: 'blue.700',
                  borderWidth: 2,
                  outline: 'none'
                }
              }}
              borderColor={nameError ? 'red' : undefined}
              id='user'
              type='text'
              w={'100%'}
            />
            <Text color={'red'}>{nameError}</Text>
          </Box>
          <Box>
            <FormLabel htmlFor='password' mt={7}>
              Пароль
            </FormLabel>
            <Input
              onChange={(e) => setPasswordValue(e.target.value)}
              value={passwordValue}
              onFocus={() => setPasswordError(null)}
              sx={{
                _hover: {
                  borderColor: passwordError ? 'red' : 'black',
                  borderWidth: 1
                },
                _focus: {},
                _focusVisible: {
                  borderColor: 'blue.700',
                  borderWidth: 2,
                  outline: 'none'
                }
              }}
              borderColor={passwordError ? 'red' : undefined}
              id='password'
              type='password'
              w={'100%'}
            />
            <Text color={'red'}>{passwordError}</Text>
          </Box>
          <Flex mt={10} justifyContent={'space-evenly'}>
            <Button
              _disabled={{ cursor: 'default' }}
              onClick={isLoginActive ? loginHandler : registrationHandler}
              w={190}
            >
              {isLoginActive ? 'Войти' : 'Зарегистрироваться'}
            </Button>
            <Button w={190} onClick={() => setIsLoginActive((prev) => !prev)}>
              {isLoginActive ? 'Зарегистрироваться' : 'Войти'}
            </Button>
          </Flex>
        </form>
      </Flex>
      <Fireworks
        options={{
          delay: { min: 100, max: 500 },
          rocketsPoint: {
            min: 0,
            max: 5
          }
        }}
        style={{
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 100,
          height: '100%',
          position: 'fixed',
          pointerEvents: 'none'
        }}
      />
    </>
  )
}
