import { create } from 'zustand'
import { ChatMessage } from '../types'

interface InitialState {
  messages: ChatMessage[]
  setMessages: (messages: ChatMessage[]) => void
  addMessage: (message: ChatMessage) => void
  changeAvatarMessage: (userId: number, imageUrl: string) => void
}

export const useMessagesStore = create<InitialState>()((set) => ({
  messages: [],
  setMessages: (messages: ChatMessage[]) => set(() => ({ messages })),
  addMessage: (message: ChatMessage) =>
    set((state) => ({
      messages: [...state.messages, message]
    })),
  changeAvatarMessage: (userId: number, imageUrl: string) => {
    set((state) => ({
      messages: state.messages.map((message) => {
        if (message.senderId === userId) {
          return { ...message, senderImg: imageUrl }
        }
        return message
      })
    }))
  }
}))
