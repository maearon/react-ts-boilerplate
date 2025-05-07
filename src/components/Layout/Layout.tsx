"use client"

import type React from "react"

import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Header from "./Header"
import Footer from "./Footer"
import { useAuthStore } from "@/stores/authStore"
import LoadingSpinner from "@/components/UI/LoadingSpinner"
import "react-toastify/dist/ReactToastify.css"
import "bootstrap/dist/css/bootstrap.min.css"

const Layout: React.FC = () => {
  const { initialized, checkAuthStatus } = useAuthStore()

  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  if (!initialized) {
    return <LoadingSpinner fullPage />
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="container flex-grow-1 py-4">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer position="top-center" autoClose={5000} />
    </div>
  )
}

export default Layout
