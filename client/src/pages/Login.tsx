import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { Box, Button, Flex, FormLabel, Input, Text } from '@chakra-ui/react'
import Fireworks from '@fireworks-js/react'
import { useProfileStore } from '../store'

export const Login: FC = () => {
  const [isLoginActive, setIsLoginActive] = useState(false)
  const [nameValue, setNameValue] = useState<string>('')
  const [nameError, setNameError] = useState<string | null>(null)
  const [passwordValue, setPasswordValue] = useState<string>('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [cookies, setCookies] = useCookies(['token'])

  const setUser = useProfileStore(({ setUser }) => setUser)
  const navigate = useNavigate()

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
        onSubmit={(event) => event.preventDefault()}
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
          <Text
            color={'blue.800'}
            mb={5}
            fontSize={20}
            textAlign={'center'}
            fontWeight={'bold'}
          >
            {isLoginActive ? 'Логин' : 'Регистрация'}
          </Text>
          <Box>
            <FormLabel color={'blue.800'} htmlFor='user'>
              Имя пользователя
            </FormLabel>
            <Input
              onChange={(e) => setNameValue(e.target.value)}
              onFocus={() => setNameError(null)}
              value={nameValue}
              color={'black'}
              sx={{
                borderColor: nameError ? 'red' : 'blue.800',
                _hover: {},
                _focus: {},
                _focusVisible: {
                  borderColor: 'blue.700',
                  borderWidth: 2,
                  outline: 'none'
                }
              }}
              id='user'
              type='text'
              w={'100%'}
            />
            <Text h={7} color={'red'}>
              {nameError}
            </Text>
          </Box>
          <Box>
            <FormLabel color={'blue.800'} htmlFor='password'>
              Пароль
            </FormLabel>
            <Input
              onChange={(e) => setPasswordValue(e.target.value)}
              value={passwordValue}
              onFocus={() => setPasswordError(null)}
              color={'black'}
              sx={{
                borderColor: passwordError ? 'red' : 'blue.800',
                _hover: {},
                _focus: {},
                _focusVisible: {
                  borderColor: 'blue.700',
                  borderWidth: 2,
                  outline: 'none'
                }
              }}
              id='password'
              type='password'
              w={'100%'}
            />
            <Text h={7} color={'red'}>
              {passwordError}
            </Text>
          </Box>
          <Flex mt={3} justifyContent={'space-evenly'}>
            <Button
              color={'whiteAlpha.900'}
              bgColor={'blue.800'}
              _hover={{
                color: 'white'
              }}
              _autofill={{ _hover: {}, _focus: {} }}
              _disabled={{ cursor: 'default' }}
              onClick={isLoginActive ? loginHandler : registrationHandler}
              w={190}
            >
              {isLoginActive ? 'Войти' : 'Зарегистрироваться'}
            </Button>
            <Button
              color={'whiteAlpha.900'}
              bgColor={'blue.800'}
              _hover={{
                color: 'white'
              }}
              w={190}
              onClick={() => setIsLoginActive((prev) => !prev)}
            >
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
