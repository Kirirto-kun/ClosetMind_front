// API interaction logic will go here
// For now, defining types and base URL

const API_BASE_URL = "http://localhost:8000" // As specified

export interface UserCredentials {
  username: string // This is email for login
  password: string
}

export interface UserRegistrationData {
  email: string
  username: string
  password: string
}

interface TokenResponse {
  access_token: string
  token_type: string
}

interface UserResponse {
  id: number
  email: string
  username: string
  is_active: boolean
  created_at: string
  updated_at?: string | null
}

export interface ChatMessage {
  message: string
}

export interface ChatResponse {
  response: string
}

export interface ClothingItemCreate {
  name: string
  image_url: string
  features?: Record<string, any>
}

export interface ClothingItemResponse extends ClothingItemCreate {
  id: number
  user_id: number
}

export interface WaitListItemCreate {
  image_url: string
  status?: string
}
export interface WaitListItemScreenshotUpload {
  image_base64: string // "data:image/png;base64,AAAA…"
}

export interface WaitListItemResponse extends WaitListItemCreate {
  id: number
  user_id: number
  created_at: string
}

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }
  if (token) {
    ;(headers as any)["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let errorData
    try {
      errorData = await response.json()
    } catch (e) {
      errorData = { message: response.statusText }
    }
    console.error(`API Error (${response.status}) on ${endpoint}:`, errorData)
    throw new Error(
      errorData.detail?.[0]?.msg ||
        errorData.detail ||
        errorData.message ||
        `Request failed with status ${response.status}`,
    )
  }

  if (response.headers.get("content-type")?.includes("application/json")) {
    return response.json()
  }
  if (response.headers.get("content-type")?.includes("application/zip")) {
    return response.blob() // For file downloads
  }
  return response.text() // Or handle other content types as needed
}

// Auth
export const apiLogin = (credentials: UserCredentials): Promise<TokenResponse> => {
  const formData = new URLSearchParams()
  formData.append("username", credentials.username)
  formData.append("password", credentials.password)

  return fetchApi("/auth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  })
}

export const apiRegister = (data: UserRegistrationData): Promise<UserResponse> =>
  fetchApi("/auth/register", { method: "POST", body: JSON.stringify(data) })

// Agent (Chat)
export const apiChat = (message: ChatMessage): Promise<ChatResponse> =>
  fetchApi("/api/v1/agent/chat", { method: "POST", body: JSON.stringify(message) })

// Wardrobe
export const apiGetWardrobeItems = (): Promise<ClothingItemResponse[]> => fetchApi("/wardrobe/items")

export const apiCreateWardrobeItem = (item: ClothingItemCreate): Promise<ClothingItemResponse> =>
  fetchApi("/wardrobe/items", { method: "POST", body: JSON.stringify(item) })

// Waitlist
export const apiGetWaitlistItems = (): Promise<WaitListItemResponse[]> => fetchApi("/waitlist/items")

export const apiAddWaitlistItem = (item: WaitListItemCreate): Promise<WaitListItemResponse> =>
  fetchApi("/waitlist/items", { method: "POST", body: JSON.stringify(item) })

export const apiUploadWaitlistScreenshot = (data: WaitListItemScreenshotUpload): Promise<WaitListItemResponse> =>
  fetchApi("/waitlist/upload-screenshot", { method: "POST", body: JSON.stringify(data) })

export const apiDownloadExtension = async (): Promise<Blob> => {
  const response = await fetch(`${API_BASE_URL}/waitlist/download-extension`, {
    method: "GET",
  })
  if (!response.ok) {
    throw new Error(`Failed to download extension: ${response.statusText}`)
  }
  return response.blob()
}
