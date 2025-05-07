"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Row, Col, Card, ListGroup } from "react-bootstrap"
import ReactPaginate from "react-paginate"
import { toast } from "react-toastify"
import { getFollowers, getFollowing } from "@/services/userService"
import UserInfo from "@/components/User/UserInfo"
import UserStats from "@/components/User/UserStats"
import LoadingSpinner from "@/components/UI/LoadingSpinner"
import type { User } from "@/types/user"

interface ShowFollowProps {
  type: "following" | "followers"
}

const ShowFollow: React.FC<ShowFollowProps> = ({ type }) => {
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [userData, setUserData] = useState<{
    id: string
    name: string
    followers: number
    following: number
    gravatar: string
    micropost: number
  } | null>(null)

  const loadData = async () => {
    if (!id) return

    setLoading(true)
    try {
      const response = type === "following" ? await getFollowing(id, page) : await getFollowers(id, page)

      setUsers(response.users || [])
      setTotalCount(response.total_count || 0)
      setUserData(response.user)
    } catch (error) {
      toast.error(`Failed to load ${type}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [id, type, page])

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPage(selectedItem.selected + 1)
  }

  if (loading && !userData) {
    return <LoadingSpinner />
  }

  if (!userData) {
    return <div className="alert alert-danger">User not found</div>
  }

  return (
    <div className="container">
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <UserInfo user={userData} micropostCount={userData.micropost} />
              <div className="mt-3">
                <UserStats userId={userData.id} following={userData.following} followers={userData.followers} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <h3 className="mb-4">
            {type === "following" ? "Following" : "Followers"} ({totalCount})
          </h3>

          {users.length > 0 ? (
            <>
              <Card>
                <ListGroup variant="flush">
                  {users.map((user) => (
                    <ListGroup.Item key={user.id} className="d-flex align-items-center">
                      <img
                        src={`https://secure.gravatar.com/avatar/${user.gravatar_id}?s=50`}
                        alt={user.name}
                        className="rounded-circle me-3"
                        width="50"
                        height="50"
                      />
                      <div>
                        <Link to={`/users/${user.id}`}>{user.name}</Link>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card>

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
            <p>No {type} yet.</p>
          )}
        </Col>
      </Row>
    </div>
  )
}

export default ShowFollow
