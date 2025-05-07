import type React from "react"
import { Link } from "react-router-dom"
import type { User } from "@/types/user"

interface UserInfoProps {
  user: User | any
  micropostCount?: number
  showProfileLink?: boolean
}

const UserInfo: React.FC<UserInfoProps> = ({ user, micropostCount, showProfileLink = false }) => {
  return (
    <div className="d-flex align-items-center mb-3">
      <img
        className="rounded-circle me-3"
        src={`https://secure.gravatar.com/avatar/${user.gravatar_id || user.gravatar}?s=50`}
        alt={user.name}
        width="50"
        height="50"
      />
      <div>
        <h1 className="h5 mb-1">{user.name}</h1>
        {showProfileLink && <Link to={`/users/${user.id}`}>view my profile</Link>}
        {micropostCount !== undefined && (
          <div>
            {micropostCount} micropost{micropostCount !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserInfo
