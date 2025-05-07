"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Row, Col, Card } from "react-bootstrap"
import ReactPaginate from "react-paginate"
import { toast } from "react-toastify"
import { getUser } from "@/services/userService"
import { useAuthStore } from "@/stores/authStore"
import UserInfo from "@/components/User/UserInfo"
import UserStats from "@/components/User/UserStats"
import FollowButton from "@/components/User/FollowButton"
import MicropostItem from "@/components/Micropost/MicropostItem"
import LoadingSpinner from "@/components/UI/LoadingSpinner"
import type { Micropost } from "@/types/micropost"
import type { UserShow } from "@/types/user"

const UserProfile = () => {
  const { id } = useParams<{ id: string }>()
  const { user: currentUser } = useAuthStore()
  const [user, setUser] = useState<UserShow | null>(null)
  const [microposts, setMicroposts] = useState<Micropost[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [isFollowing, setIsFollowing] = useState(false)

  const loadUser = async () => {
    if (!id) return

    setLoading(true)
    try {
      const response = await getUser(id, { page })
      setUser(response.user)
      setMicroposts(response.microposts || [])
      setTotalCount(response.total_count || 0)
      setIsFollowing(response.user.current_user_following_user)
    } catch (error) {
      toast.error("Failed to load user profile")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      loadUser()
    }
  }, [id, page])

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPage(selectedItem.selected + 1)
  }

  const handleFollowChange = (following: boolean) => {
    setIsFollowing(following)
    if (user) {
      setUser({
        ...user,
        current_user_following_user: following,
        followers: following ? user.followers + 1 : user.followers - 1,
      })
    }
  }

  const handleMicropostDeleted = () => {
    loadUser()
  }

  if (loading && !user) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <div className="alert alert-danger">User not found</div>
  }

  return (
    <div className="container">
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <UserInfo user={user} />
              <div className="mt-3">
                <UserStats userId={user.id} following={user.following} followers={user.followers} />
              </div>
            </Card.Body>
          </Card>

          {currentUser && currentUser.id !== user.id && (
            <Card className="mb-4">
              <Card.Body className="text-center">
                <FollowButton userId={id!} isFollowing={isFollowing} onFollowChange={handleFollowChange} />
              </Card.Body>
            </Card>
          )}
        </Col>

        <Col md={8}>
          <h3 className="mb-4">Microposts ({totalCount})</h3>

          {microposts.length > 0 ? (
            <>
              {microposts.map((post) => (
                <MicropostItem key={post.id} micropost={post} onDelete={handleMicropostDeleted} />
              ))}

              {totalCount > 10 && (
                <div className="d-flex justify-content-center mt-4">
                  <ReactPaginate
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    breakLabel={"..."}
                    pageCount={Math.ceil(totalCount / 10)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageChange}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    previousClassName={"page-item"}
                    previousLinkClassName={"page-link"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link"}
                    breakClassName={"page-item"}
                    breakLinkClassName={"page-link"}
                  />
                </div>
              )}
            </>
          ) : (
            <p>No microposts yet.</p>
          )}
        </Col>
      </Row>
    </div>
  )
}

export default UserProfile
