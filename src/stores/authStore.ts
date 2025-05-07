import { create } from "zustand"
import { persist } from "zustand/middleware"
import { api, handleApiResponse } from "@/services/api"
import type { User, LoginCredentials } from "@/types/auth"

interface AuthState {
  user: User | null
  loggedIn: boolean
  loading: boolean
  error: any
  initialized: boolean
  accessToken: string | null
  refreshToken: string | null

  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  checkAuthStatus: () => Promise<void>
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void
  clearError: () => void
}

interface LoginResponse {
  tokens?: {
    access?: { token: string }
    refresh?: { token: string }
  }
  user?: User
}

interface SessionResponse {
  user?: User
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loggedIn: false,
      loading: false,
      error: null,
      initialized: false,
      accessToken: null,
      refreshToken: null,

      login: async (credentials: LoginCredentials) => {
        set({ loading: true, error: null })

        try {
          const rawResponse = await handleApiResponse(
            api.post("login", { json: { session: credentials } }).json()
          )
          const response = rawResponse as LoginResponse

          if (response.tokens?.access?.token) {
            const accessToken = response.tokens.access.token
            const refreshToken = response.tokens.refresh?.token || ""

            if (credentials.remember_me) {
              localStorage.setItem("token", accessToken)
              localStorage.setItem("remember_token", refreshToken)
            } else {
              sessionStorage.setItem("token", accessToken)
              sessionStorage.setItem("remember_token", refreshToken)
            }

            set({
              loading: false,
              loggedIn: true,
              user: response.user ?? null,
              accessToken,
              refreshToken,
            })
          } else {
            throw new Error("Invalid response from server")
          }
        } catch (error) {
          set({ loading: false, error })
          throw error
        }
      },

      logout: async () => {
        try {
          await handleApiResponse(api.delete("logout").json())
        } catch (error) {
          console.error("Logout error:", error)
        } finally {
          localStorage.removeItem("token")
          localStorage.removeItem("remember_token")
          sessionStorage.removeItem("token")
          sessionStorage.removeItem("remember_token")

          set({
            loggedIn: false,
            user: null,
            accessToken: null,
            refreshToken: null,
          })
        }
      },

      checkAuthStatus: async () => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token")

        if (!token) {
          set({ loggedIn: false, user: null, initialized: true })
          return
        }

        set({ loading: true })

        try {
          const rawResponse = await handleApiResponse(api.get("sessions").json())
          const response = rawResponse as SessionResponse

          if (response.user) {
            set({
              loading: false,
              loggedIn: true,
              user: response.user,
              initialized: true,
            })
          } else {
            set({
              loading: false,
              loggedIn: false,
              user: null,
              initialized: true,
            })
          }
        } catch {
          set({
            loading: false,
            loggedIn: false,
            user: null,
            initialized: true,
          })
        }
      },

      setTokens: ({ accessToken, refreshToken }) => {
        set({ accessToken, refreshToken })
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        loggedIn: state.loggedIn,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
)
