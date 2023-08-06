export interface ApiResponse<T> {
  status: 'success' | 'error'
  payload: T
}