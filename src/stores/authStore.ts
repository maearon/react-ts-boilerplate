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

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  checkAuthStatus: () => Promise<void>
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
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
          const response = await handleApiResponse(api.post("login", { json: { session: credentials } }).json())

          if (response.tokens && response.tokens.access) {
            const { token } = response.tokens.access
            const rememberToken = response.tokens.refresh?.token || ""

            if (credentials.remember_me) {
              localStorage.setItem("token", token)
              localStorage.setItem("remember_token", rememberToken)
            } else {
              sessionStorage.setItem("token", token)
              sessionStorage.setItem("remember_token", rememberToken)
            }

            set({
              loading: false,
              loggedIn: true,
              user: response.user,
              accessToken: token,
              refreshToken: rememberToken,
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
          // Even if API call fails, still clear local storage
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
          const response = await handleApiResponse(api.get("sessions").json())

          if (response && response.user) {
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
        } catch (error) {
          set({
            loading: false,
            loggedIn: false,
            user: null,
            initialized: true,
          })
        }
      },

      setTokens: (tokens) => {
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        })
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
    },
  ),
)
