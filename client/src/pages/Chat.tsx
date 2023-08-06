import { FC, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import { Flex } from '@chakra-ui/react'
import { ChatInput, Messages, Profile, ThemeSettings } from '../components'
import { wsConnection, wsSend } from '../ws'
import {
  useMessagesStore,
  useNotificationStore,
  useProfileStore,
} from '../store'
import { WSResponse } from '../types'
import { api } from '../utils'
import { useTitle } from '../hooks'
import { shallow } from 'zustand/shallow'

export const Chat: FC = () => {
  const [cookies, _, deleteCookies] = useCookies(['token'])
  const setNotification = useNotificationStore(
    ({ setNotification }) => setNotification,
  )
  const { updateTitle, title } = useTitle()
  const navigate = useNavigate()
  const user = useProfileStore((user) => user)
  const setMessages = useMessagesStore(({ setMessages }) => setMessages)
  const changeAvatarMessage = useMessagesStore(({ changeAvatarMessage }) => changeAvatarMessage)
  const addMessage = useMessagesStore(({ addMessage }) => addMessage)

  useEffect(() => {
    const setDefaultTitle = () => {
      updateTitle('Chat')
    }

    if (title !== 'Chat') {
      window.addEventListener('focus', setDefaultTitle)
    }

    return () => {
      if (title !== 'Chat') {
        window.removeEventListener('focus', setDefaultTitle)
      }
    }
  }, [title])

  useEffect(() => {
    if (!cookies.token) {
      navigate('/login')
      return
    }

    api('/verifyToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: cookies.token,
      }),
    })
      .then((data) => {
        if (data.status === 'success') {
          wsSend('me', data.payload.id)
          wsSend('chat-messages', null)
          user.setUser(data.payload)
        } else {
          throw new Error('wrong token')
        }
      })
      .catch(() => {
        navigate('/login')
        deleteCookies('token')
      })
  }, [cookies.token])

  useEffect(() => {
    wsConnection.onmessage = (message) => {
      const data = JSON.parse(message.data) as WSResponse
      switch (data.event) {
        case 'chat-messages':
          const messages = data.payload as {
            message_id: number
            send_at: number
            message_text: string
            sender_name: string
            sender_id: number
            sender_image: string | null
            message_directed_to?: number | null
          }[]

          setMessages(
            messages.map((payloadMessage) => ({
              id: payloadMessage.message_id,
              sendAt: payloadMessage.send_at,
              text: payloadMessage.message_text,
              senderId: payloadMessage.sender_id,
              senderName: payloadMessage.sender_name,
              senderImg: payloadMessage.sender_image || undefined,
              isMessageDirected:
                payloadMessage.message_directed_to === user.user.id,
            })),
          )
          break
        case 'chat-message':
          if (data.payload.isMessageDirected) {
            if (document.hidden) {
              updateTitle('New message')
            }
            setNotification({
              message: `Новое сообщение от ${data.payload.sender_name}`,
              status: 'success',
            })
          }
          addMessage({
            id: data.payload.message_id,
            sendAt: data.payload.send_at,
            text: data.payload.message_text,
            senderId: data.payload.sender_id,
            senderName: data.payload.sender_name,
            senderImg: data.payload.sender_image || undefined,
            isMessageDirected: data.payload.isMessageDirected,
          })
          break
        case 'avatar-change':
          if (user.user.id === data.payload.userId) {
            user.changeAvatar(data.payload.imageUrl)
          }
          changeAvatarMessage(data.payload.userId, data.payload.imageUrl)
          break
        default:
          break
      }
    }
  }, [user.user.id])

  return (
    <>
      <Flex flexDirection={'column'}>
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
