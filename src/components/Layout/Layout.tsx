"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Header from "./Header"
import Footer from "./Footer"
import { useAuthStore } from "@/stores/authStore"
import LoadingSpinner from "@/components/UI/LoadingSpinner"
import "react-toastify/dist/ReactToastify.css"
import "bootstrap/dist/css/bootstrap.min.css"
import Sidebar from "./Sidebar"

const Layout: React.FC = () => {
  const { initialized, checkAuthStatus } = useAuthStore()
  const [isSidebarOpen, setSidebarOpen] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    const stored = localStorage.getItem("is-sidebar-open")
    setSidebarOpen(stored === null ? true : stored === "true")
  }, [])

  useEffect(() => {
    if (isSidebarOpen !== undefined) {
      localStorage.setItem("is-sidebar-open", isSidebarOpen ? "true" : "false")
    }
  }, [isSidebarOpen])

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev)
  }

  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  if (isSidebarOpen === undefined || !initialized) {
    return <LoadingSpinner fullPage />
  }

  return (
    <div className="d-flex min-vh-100">

      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

      <div className="flex-grow-1 d-flex flex-column bg-light">
        <Header />

        <main className="flex-grow-1 container py-4">
          <Outlet />
        </main>

        <Footer />
      </div>

      <ToastContainer position="top-center" autoClose={5000} />
    </div>
  )
}

export default Layout
