"use client"

import type React from "react"

import { Link } from "react-router-dom"
import { useAuthStore } from "@/stores/authStore"
import { toast } from "react-toastify"
import { deleteMicropost } from "@/services/micropostService"
import type { Micropost } from "@/types/micropost"

interface MicropostItemProps {
  micropost: Micropost
  onDelete?: (id: number) => void
}

const MicropostItem: React.FC<MicropostItemProps> = ({ micropost, onDelete }) => {
  const { user } = useAuthStore()

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()

    if (window.confirm("Are you sure?")) {
      try {
        const response = await deleteMicropost(micropost.id)
        if (response.flash) {
          toast.success(response.flash[1])
          if (onDelete) onDelete(micropost.id)
        }
      } catch (error) {
        toast.error("Failed to delete micropost")
      }
    }
  }

  return (
    <div className="d-flex mb-4">
      <Link to={`/users/${micropost.user_id}`} className="me-3">
        <img
          className="rounded-circle"
          src={`https://secure.gravatar.com/avatar/${micropost.gravatar_id}?s=${micropost.size}`}
          alt={micropost.user_name}
          width={micropost.size}
          height={micropost.size}
        />
      </Link>
      <div className="flex-grow-1">
        <div className="mb-1">
          <Link to={`/users/${micropost.user_id}`}>{micropost.user_name}</Link>
        </div>
        <div className="mb-2">
          {micropost.content}
          {micropost.image && (
            <img src={micropost.image || "/placeholder.svg"} alt="Post image" className="img-fluid mt-2" />
          )}
        </div>
        <div className="text-muted small">
          Posted {micropost.timestamp} ago.
          {user?.id === micropost.user_id && (
            <a href="#" onClick={handleDelete} className="ms-2">
              delete
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default MicropostItem
