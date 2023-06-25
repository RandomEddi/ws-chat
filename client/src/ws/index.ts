import { wsEvents } from '../types'

export const wsConnection = new WebSocket('ws://localhost:3000')

wsConnection.onerror = function (this: any, event: Event) {
  console.error('error', event)
}

wsConnection.onopen = function () {
  console.log('connected')
}

export const wsSend = (event: wsEvents, payload: any) => {
  const message = JSON.stringify({ event, payload: payload })
  if (!wsConnection.readyState) {
    setTimeout(() => wsSend(event, payload))
  } else {
    wsConnection.send(message)
  }
}
