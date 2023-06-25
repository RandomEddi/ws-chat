import { create } from 'zustand'
import { IUser } from '../types'

interface IInitialState {
  user: IUser
  setUser: (user: IUser) => void
  changeAvatar: (imageUrl: string) => void
}

export const useProfileStore = create<IInitialState>()((set) => ({
  user: {
    id: 0,
    name: '',
    token: ''
  },
  setUser: (user: IUser) =>
    set(() => ({
      user
    })),
  changeAvatar: (imageUrl: string) =>
    set((state) => ({
      user: { ...state.user, imageUrl }
    }))
}))
