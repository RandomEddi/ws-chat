export type NotificationStatus =
  | 'error'
  | 'info'
  | 'warning'
  | 'success'
  | 'loading'

export interface Notification {
  id: number
  open: boolean
  status: NotificationStatus
  message: string
}
