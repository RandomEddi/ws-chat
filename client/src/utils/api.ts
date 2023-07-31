export const api = async (url: string, parameters?: RequestInit, body?: any) => {
  const response = await fetch(
    import.meta.env.VITE_BASE_URL + url,
    parameters
      ? {
          ...parameters,
          body: body ? JSON.stringify(body) : undefined,
        }
      : undefined,
  )
  return await response.json()
}
