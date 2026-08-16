const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api'
const SERVER_ORIGIN = API_URL.replace(/\/api\/?$/, '')
const TOKEN_KEY = 'alharafyeen-token'

// Product images are stored as server-relative paths (e.g. "/uploads/xyz.jpg").
// This resolves them to a full URL the <img> tag can actually load.
export function getAssetUrl(path?: string | null): string {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${SERVER_ORIGIN}${path}`
}

export function getToken(): string | null {
  return (
    localStorage.getItem(TOKEN_KEY) ??
    sessionStorage.getItem(TOKEN_KEY)
  )
}

export function setToken(
  token: string | null,
  rememberMe = true
) {
  if (token) {
    if (rememberMe) {
      localStorage.setItem(TOKEN_KEY, token)
      sessionStorage.removeItem(TOKEN_KEY)
    } else {
      sessionStorage.setItem(TOKEN_KEY, token)
      localStorage.removeItem(TOKEN_KEY)
    }
  } else {
    localStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
  }
}

export class ApiClientError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
  auth?: boolean
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    body,
    auth = true,
  } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  const token = getToken()

  if (auth && token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 204) {
    return undefined as T
  }

  const isJson = res.headers
    .get('content-type')
    ?.includes('application/json')

  const data = isJson ? await res.json() : undefined

  if (!res.ok) {
    throw new ApiClientError(
      res.status,
      (data as { error?: string })?.error ??
        'حدث خطأ غير متوقع'
    )
  }

  return data as T
}

export const api = {
  get: <T>(path: string) =>
    apiRequest<T>(path, { method: 'GET' }),

  post: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, {
      method: 'POST',
      body,
    }),

  patch: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, {
      method: 'PATCH',
      body,
    }),

  delete: <T>(path: string) =>
    apiRequest<T>(path, { method: 'DELETE' }),
}

export async function uploadImage(
  file: File
): Promise<{ url: string }> {
  const formData = new FormData()

  formData.append('image', file)

  const token = getToken()

  const headers: Record<string, string> = {}

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${API_URL}/uploads/image`, {
    method: 'POST',
    headers,
    body: formData,
  })

  const data = await res.json()

  if (!res.ok) {
    throw new ApiClientError(
      res.status,
      data?.error ?? 'تعذّر رفع الصورة'
    )
  }

  return data as { url: string }
}