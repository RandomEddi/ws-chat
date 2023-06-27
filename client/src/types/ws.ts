export type wsEvents = 'chat-message' | 'chat-messages' | 'avatar-change' | 'me'

export interface WSResponse<T = any> {
  event: wsEvents
  payload: T
}
