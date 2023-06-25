import { FC, useEffect } from 'react'
import { Flex } from '@chakra-ui/react'
import { ChatInput, Messages, Profile, ThemeSettings } from '../components'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import { wsConnection, wsSend } from '../ws'
import { useMessagesStore, useProfileStore } from '../store'
import { IWSResponse } from '../types'

export const Chat: FC = () => {
  const [cookies, _, deleteCookies] = useCookies(['token'])
  const navigate = useNavigate()
  const setUser = useProfileStore(({ setUser }) => setUser)
  const { setMessages, addMessage } = useMessagesStore(
    ({ setMessages, addMessage }) => ({
      setMessages,
      addMessage
    })
  )

  useEffect(() => {
    if (!cookies.token) {
      navigate('/login')
      return
    }

    wsConnection.onopen = function () {
      console.log('connected')
    }

    wsConnection.onmessage = (message) => {
      const data = JSON.parse(message.data) as IWSResponse
      switch (data.event) {
        case 'chat-messages':
          const messages = data.payload as {
            message_id: number
            send_at: number
            message_text: string
            sender_name: string
          }[]

          setMessages(
            messages.map((payloadMessage) => ({
              id: payloadMessage.message_id,
              sendAt: payloadMessage.send_at,
              text: payloadMessage.message_text,
              senderName: payloadMessage.sender_name
            }))
          )
          break
        case 'chat-message':
          addMessage({
            id: data.payload.message_id,
            sendAt: data.payload.send_at,
            text: data.payload.message_text,
            senderName: data.payload.sender_name
          })
          break
        default:
          break
      }
    }
    ;(async () => {
      fetch('http://localhost:5000/verifyToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: cookies.token
        })
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (data.status === 'success') {
            wsSend('chat-messages', null)
            setUser(data.payload)
          } else {
            navigate('/login')
            deleteCookies('token')
          }
        })
    })()
  }, [])

  return (
    <>
      <Flex>
        <Messages />
        <ChatInput />
      </Flex>
      <Flex
        position={'fixed'}
        zIndex={100}
        left={'4'}
        top={'4'}
        right={'4'}
        justifyContent={'space-between'}
      >
        <ThemeSettings />
        <Profile />
      </Flex>
    </>
  )
}
