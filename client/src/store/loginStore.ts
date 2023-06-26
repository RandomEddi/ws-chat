import { create } from 'zustand'

interface IInitialState {
  name: string
  nameError: string | null
  password: string
  passwordError: string | null
  setName: (value: string) => void
  setNameError: (error: string | null) => void
  setPassword: (value: string) => void
  setPasswordError: (error: string | null) => void
}

export const useLoginStore = create<IInitialState>()((set) => ({
  name: '',
  nameError: null,
  password: '',
  passwordError: null,
  setName: (value: string) => set((state) => ({ ...state, name: value })),
  setNameError: (error: string | null) =>
    set((state) => ({ ...state, nameError: error })),
  setPassword: (value: string) =>
    set((state) => ({ ...state, password: value })),
  setPasswordError: (error: string | null) =>
    set((state) => ({ ...state, passwordError: error }))
}))
