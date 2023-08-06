import { create } from 'zustand'
import { Notification } from '../types'

interface InitialState {
  setNotification: (notification: Omit<Notification, 'id' | 'open'>) => void
  clearNotification: () => void
}

export const useNotificationStore = create<InitialState & Notification>()(
  (set) => ({
    id: -1,
    open: false,
    status: 'info',
    message: '',
    setNotification: (newNotification) =>
      set({
        message: newNotification.message,
        status: newNotification.status,
        id: Date.now(),
        open: true,
      }),
    clearNotification: () => {
      set(
        {
          open: false,
        },
        true,
      )
    },
  }),
)
