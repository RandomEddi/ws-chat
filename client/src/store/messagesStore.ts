import { create } from 'zustand'
import { IMessage } from '../types'

interface IInitialState {
  messages: IMessage[]
  setMessages: (messages: IMessage[]) => void
  addMessage: (message: IMessage) => void
  changeAvatarMessage: (userId: number, imageUrl: string) => void
}

export const useMessagesStore = create<IInitialState>()((set) => ({
  messages: [],
  setMessages: (messages: IMessage[]) => set(() => ({ messages })),
  addMessage: (message: IMessage) =>
    set((state) => ({
      messages: [...state.messages, message]
    })),
  changeAvatarMessage: (userId: number, imageUrl: string) => {
    set((state) => ({
      messages: state.messages.map(message => {
        if (message.senderId === userId) {
          return {...message, senderImg: imageUrl}
        }
        return message
      })
    }))
  }
}))
