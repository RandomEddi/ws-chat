import { Alert, AlertDescription, AlertIcon, Progress } from '@chakra-ui/react'
import { useEffect, type FC, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNotificationStore } from '../store'

const PROGRESS_SPEED = 40
const PROGRESS_INCREASED_BY = 1

export const Notification: FC = () => {
  const notification = useNotificationStore(
    ({ id, message, open, status }) => ({ id, message, open, status }),
  )
  const clearNotification = useNotificationStore(
    ({ clearNotification }) => clearNotification,
  )
  const [notificationProgress, setNotificationProgress] = useState<number>(0)
  const interval = useRef<NodeJS.Timer | null>(null)

  const clearCurrentInterval = () => {
    if (interval.current) {
      setNotificationProgress(0)
      clearInterval(interval.current)
      interval.current = null
    }
  }

  useEffect(() => {
    if (!notification.open) return

    interval.current = setInterval(() => {
      setNotificationProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearCurrentInterval()
          clearNotification()
          return 0
        }
        return prevProgress + PROGRESS_INCREASED_BY
      })
    }, PROGRESS_SPEED)

    return () => {
      clearCurrentInterval()
    }
  }, [notification.id, notification.open])

  if (!notification.open) return <></>

  const notificationColor =
    notification.status === 'success'
      ? 'green'
      : notification.status === 'error'
      ? 'red'
      : 'blue'

  return createPortal(
    <Alert
      w={'auto'}
      position={'absolute'}
      left={'50%'}
      top={1}
      transform={'translate(-50%, 0)'}
      zIndex={1000}
      status={notification.status}
    >
      <AlertIcon />
      <AlertDescription color={'black'}>
        {notification.message}
      </AlertDescription>
      {notification.status !== 'loading' && (
        <Progress
          position={'absolute'}
          left={0}
          right={0}
          hasStripe
          colorScheme={notificationColor}
          bottom={0}
          size='xs'
          value={notificationProgress}
        />
      )}
    </Alert>,
    document.querySelector('#notification')!,
  )
}
