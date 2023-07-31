import { create } from 'zustand'
import { Notification } from '../types'

interface InitialState {
  notification: Notification
  setNotification: (notification: Omit<Notification, 'id' | 'open'>) => void
  clearNotification: () => void
}

export const useNotificationStore = create<InitialState>()((set) => ({
  notification: {
    id: -1,
    open: false,
    status: 'info',
    message: '',
  },
  setNotification: (newNotification) =>
    set(() => ({
      notification: {
        ...newNotification,
        id: Date.now(),
        open: true
      },
    })),
  clearNotification: () => {
    set(() => ({
      notification: {
        id: -1,
        open: false,
        status: 'success',
        message: '',
      },
    }))
  },
}))
