export type wsEvents = 'chat-message' | 'chat-messages' | 'change-avatar'

export interface IWSResponse<T = any> {
  event: wsEvents
  payload: T
}
