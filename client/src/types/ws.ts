export type wsEvents = 'chat-message' | 'chat-messages' | 'avatar-change' | 'me'

export interface IWSResponse<T = any> {
  event: wsEvents
  payload: T
}
