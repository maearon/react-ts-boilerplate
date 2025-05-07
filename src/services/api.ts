import ky from "ky"
import { useAuthStore } from "@/stores/authStore"

// Base API URL
const BASE_URL = "https://ruby-rails-boilerplate-3s9t.onrender.com/api"

// Create a custom Ky instance
const createKyInstance = () => {
  const authStore = useAuthStore.getState()

  return ky.create({
    prefixUrl: BASE_URL,
    headers: {
      "Content-Type": "application/json",
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
        async (request, options, response) => {
          // Handle 401 Unauthorized errors
          if (response.status === 401 && !request.url.includes("/sessions") && !request.url.includes("/refresh")) {
            try {
              // Try to refresh the token
              const refreshToken = localStorage.getItem("refresh_token") || sessionStorage.getItem("refresh_token")

              if (refreshToken) {
                const refreshResponse = await ky
                  .post(`${BASE_URL}/refresh`, {
                    json: { refresh_token: refreshToken },
                  })
                  .json()

                if (refreshResponse.tokens) {
                  const { token, remember_token } = refreshResponse.tokens.access

                  // Update tokens in storage
                  if (localStorage.getItem("token")) {
                    localStorage.setItem("token", token)
                    localStorage.setItem("remember_token", remember_token || "")
                  } else {
                    sessionStorage.setItem("token", token)
                    sessionStorage.setItem("remember_token", remember_token || "")
                  }

                  // Update auth store
                  authStore.setTokens({
                    accessToken: token,
                    refreshToken: remember_token || "",
                  })

                  // Retry the original request
                  request.headers.set("Authorization", `Bearer ${token} ${remember_token || ""}`)
                  return ky(request)
                }
              }
            } catch (error) {
              // If refresh fails, log out the user
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

// Export API instance
export const api = createKyInstance()

// Helper function to handle API responses\
export const handleApiResponse = async <T>(promise: Promise<any>)
: Promise<T> =>
{
  try {
    const data = await promise
    return data as T;
  } catch (error: any) {
    if (error.response) {
      // For 401 errors when accessing /sessions endpoint, don't reject the promise
      if (error.response.status === 401 && error.request.url.includes("/sessions")) {
        console.log("Handling 401 error silently for auth check")
        // Return an empty successful response instead of rejecting
        return { user: null, loggedIn: false } as unknown as T;
      }

      // Try to parse error response
      try {
        const errorData = await error.response.json()
        throw errorData
      } catch (parseError) {
        throw error
      }
    }
    throw error
  }
}
