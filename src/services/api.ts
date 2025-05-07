import ky from "ky"
import { useAuthStore } from "@/stores/authStore"

let BASE_URL = ""
if (process.env.NODE_ENV === "development") {
  BASE_URL = "http://localhost:3000/api"
} else {
  BASE_URL = "https://ruby-rails-boilerplate-3s9t.onrender.com/api"
}

interface RefreshResponse {
  tokens: {
    access: {
      token: string
      remember_token?: string
    }
  }
}

const createKyInstance = () => {
  return ky.create({
    prefixUrl: BASE_URL,
    headers: {
      Accept: "application/json",
      "x-lang": "EN",
    },
    hooks: {
      beforeRequest: [
        (request) => {
          const token = localStorage.getItem("token") || sessionStorage.getItem("token")
          const rememberToken = localStorage.getItem("remember_token") || sessionStorage.getItem("remember_token")

          if (token && token !== "undefined") {
            request.headers.set("Authorization", `Bearer ${token} ${rememberToken || ""}`)
          }
        },
      ],
      afterResponse: [
        async (request, _options, response) => {
          if (
            response.status === 401 &&
            !request.url.includes("/sessions") &&
            !request.url.includes("/refresh")
          ) {
            try {
              const refreshToken =
                localStorage.getItem("refresh_token") || sessionStorage.getItem("refresh_token")

              if (refreshToken) {
                const refreshResponse = await ky
                  .post(`${BASE_URL}/refresh`, {
                    json: { refresh_token: refreshToken },
                  })
                  .json<RefreshResponse>()

                const { token, remember_token } = refreshResponse.tokens.access

                if (localStorage.getItem("token")) {
                  localStorage.setItem("token", token)
                  localStorage.setItem("remember_token", remember_token || "")
                } else {
                  sessionStorage.setItem("token", token)
                  sessionStorage.setItem("remember_token", remember_token || "")
                }

                const authStore = useAuthStore.getState()
                authStore.setTokens({
                  accessToken: token,
                  refreshToken: remember_token || "",
                })

                request.headers.set("Authorization", `Bearer ${token} ${remember_token || ""}`)
                return ky(request)
              }
            } catch (error) {
              const authStore = useAuthStore.getState()
              authStore.logout()
              return response
            }
          }

          return response
        },
      ],
    },
    retry: {
      limit: 2,
      methods: ["get", "put", "post", "patch", "delete"],
      statusCodes: [408, 413, 429, 500, 502, 503, 504],
    },
    credentials: "include",
    timeout: 30000,
  })
}

export const api = createKyInstance()

export const handleApiResponse = async <T>(promise: Promise<T>): Promise<T> => {
  try {
    const data = await promise
    return data as T
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 401 && error.request.url.includes("/sessions")) {
        console.log("Handling 401 error silently for auth check")
        return { user: null, loggedIn: false } as unknown as T
      }

      try {
        const errorData = await error.response.json()
        throw errorData
      } catch {
        throw error
      }
    }
    throw error
  }
}
