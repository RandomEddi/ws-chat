import { create } from 'zustand'
import { User } from '../types'

interface InitialState {
  user: User
  setUser: (user: User) => void
  changeAvatar: (imageUrl: string) => void
}

export const useProfileStore = create<InitialState>()((set) => ({
  user: {
    id: 0,
    name: '',
    token: ''
  },
  setUser: (user: User) =>
    set(() => ({
      user
    })),
  changeAvatar: (imageUrl: string) =>
    set((state) => ({
      user: { ...state.user, imageUrl }
    }))
}))
