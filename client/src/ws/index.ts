import { wsEvents } from '../types'

const connect = () => {
  
}

export let wsConnection = new WebSocket('ws://localhost:3000')

wsConnection.onerror = function (this: any, event: Event) {
  console.error('error', event)
}

wsConnection.onopen = function () {
  console.log('connected')
  //@ts-ignore
  window.wss = wsConnection
}

wsConnection.onclose = function () {
  console.log('disconnected')
  setTimeout(() => {
    wsConnection = new WebSocket('ws://localhost:3000')
  }, 500)
}

export const wsSend = (event: wsEvents, payload: any) => {
  const message = JSON.stringify({ event, payload: payload })
  if (!wsConnection.readyState) {
    setTimeout(() => wsSend(event, payload))
  } else {
    wsConnection.send(message)
  }
}
