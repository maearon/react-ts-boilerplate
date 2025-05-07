import type React from "react"
import { Link } from "react-router-dom"

interface UserStatsProps {
  userId: string | number
  following: number
  followers: number
}

const UserStats: React.FC<UserStatsProps> = ({ userId, following, followers }) => {
  return (
    <div className="d-flex justify-content-around">
      <Link to={`/users/${userId}/following`} className="text-decoration-none text-center">
        <div className="h5 mb-0">{following}</div>
        <div>following</div>
      </Link>
      <Link to={`/users/${userId}/followers`} className="text-decoration-none text-center">
        <div className="h5 mb-0">{followers}</div>
        <div>followers</div>
      </Link>
    </div>
  )
}

export default UserStats
