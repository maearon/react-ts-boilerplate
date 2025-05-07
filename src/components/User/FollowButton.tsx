"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "react-bootstrap"
import { toast } from "react-toastify"
import { followUser, unfollowUser } from "@/services/relationshipService"

interface FollowButtonProps {
  userId: string
  isFollowing: boolean
  onFollowChange?: (isFollowing: boolean) => void
}

const FollowButton: React.FC<FollowButtonProps> = ({ userId, isFollowing, onFollowChange }) => {
  const [loading, setLoading] = useState(false)

  const handleFollow = async () => {
    setLoading(true)
    try {
      const response = await followUser(userId)
      if (response.follow) {
        if (onFollowChange) onFollowChange(true)
      }
    } catch (error) {
      toast.error("Failed to follow user")
    } finally {
      setLoading(false)
    }
  }

  const handleUnfollow = async () => {
    setLoading(true)
    try {
      const response = await unfollowUser(userId)
      if (response.unfollow) {
        if (onFollowChange) onFollowChange(false)
      }
    } catch (error) {
      toast.error("Failed to unfollow user")
    } finally {
      setLoading(false)
    }
  }

  return isFollowing ? (
    <Button variant="outline-danger" onClick={handleUnfollow} disabled={loading}>
      {loading ? "Processing..." : "Unfollow"}
    </Button>
  ) : (
    <Button variant="primary" onClick={handleFollow} disabled={loading}>
      {loading ? "Processing..." : "Follow"}
    </Button>
  )
}

export default FollowButton
