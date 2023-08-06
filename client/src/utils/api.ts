export const api = async <T = any>(
  url: string,
  parameters?: RequestInit,
): Promise<T> => {
  const response = await fetch(import.meta.env.VITE_BASE_URL + url, parameters)
  return await response.json()
}
