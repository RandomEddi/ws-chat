export const api = async <T = any>(
  url: string,
  parameters?: RequestInit,
): Promise<T> => {
  const response = await fetch(import.meta.env.VITE_BASE_URL + url, {
    ...parameters,
    headers: {
      'Content-Type': 'application/json',
      ...parameters?.headers,
    },
  })
  return await response.json()
}
