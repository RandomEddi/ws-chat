import { create } from 'zustand'
import { IUser } from '../types'

interface IInitialState {
  user: IUser
  setUser: (user: IUser) => void
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
    }))
}))
