import type React from "react"
import { Navigate, useLocation } from "react-router-dom"
import { toast } from "react-toastify"
import { useAuthStore } from "@/stores/authStore"
import LoadingSpinner from "@/components/UI/LoadingSpinner"

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { loggedIn, initialized } = useAuthStore()
  const location = useLocation()

  if (!initialized) {
    return <LoadingSpinner fullPage />
  }

  if (!loggedIn) {
    toast.error("Please log in to access this page")
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
