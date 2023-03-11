import { wsEvent } from '../types'

export const wsConnection = new WebSocket('ws://localhost:5000')

wsConnection.onopen = function () {
  console.log('connected')
}

wsConnection.onerror = function () {
  console.log('error')
}

export const wsSend = (event: wsEvent, data: any) => {
  const message = JSON.stringify({ event, payload: data })
  if (!wsConnection.readyState) {
    setTimeout(() => wsSend(event, message))
  } else {
    wsConnection.send(message)
  }
}
