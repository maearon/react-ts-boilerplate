"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card, Row, Col, Alert } from "react-bootstrap"
import ReactPaginate from "react-paginate"
import { toast } from "react-toastify"
import { useAuthStore } from "@/stores/authStore"
import MicropostForm from "@/components/Micropost/MicropostForm"
import MicropostItem from "@/components/Micropost/MicropostItem"
import UserInfo from "@/components/User/UserInfo"
import UserStats from "@/components/User/UserStats"
import { getMicroposts } from "@/services/micropostService"
import type { Micropost } from "@/types/micropost"
import LoadingSpinner from "@/components/UI/LoadingSpinner"
import reactLogo from "@/assets/react.svg"

const Home: React.FC = () => {
  const { loggedIn, user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [feedItems, setFeedItems] = useState<Micropost[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [followersCount, setFollowersCount] = useState(0)
  const [micropostCount, setMicropostCount] = useState(0)
  // const [gravatar, setGravatar] = useState("")

  const loadFeed = async () => {
    try {
      const response = await getMicroposts({ page })
      setFeedItems(response.feed_items || [])
      setTotalCount(response.total_count || 0)
      setFollowingCount(response.following || 0)
      setFollowersCount(response.followers || 0)
      setMicropostCount(response.micropost || 0)
      // setGravatar(response.gravatar || "")
    } catch (error) {
      console.error("Error loading feed:", error)
      toast.error("Failed to load feed")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (loggedIn) {
      loadFeed()
    } else {
      setLoading(false)
    }
  }, [loggedIn, page])

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPage(selectedItem.selected + 1)
  }

  const handleMicropostDeleted = () => {
    loadFeed()
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!loggedIn) {
    return (
      <div className="text-center jumbotron bg-light p-5 rounded">
        <h1 className="display-4">Welcome to the Sample App</h1>
        <p className="lead">
          This is the home page for the
          <a href="https://react.dev/" target="_blank" rel="noopener noreferrer">
            {" "}
            React Tutorial{" "}
          </a>
          sample application.
        </p>
        <Link to="/signup" className="btn btn-lg btn-primary">
          Sign up now!
        </Link>
        <div className="text-center mt-4">
          <a href="https://react.dev/" target="_blank" rel="noopener noreferrer">
            <img src={reactLogo} alt="React logo" width="180" height="38" />
          </a>
        </div>
      </div>
    )
  }

  return (
    <Row>
      <Col md={4}>
        <Card className="mb-4">
          <Card.Body>
            {user && <UserInfo user={user} micropostCount={micropostCount} showProfileLink={true} />}
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Body>
            <UserStats userId={user?.id ?? ""} following={followingCount} followers={followersCount} />
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <MicropostForm onPostCreated={loadFeed} />
          </Card.Body>
        </Card>
      </Col>

      <Col md={8}>
        <h3 className="mb-4">Micropost Feed</h3>

        {feedItems.length > 0 ? (
          <>
            {feedItems.map((item) => (
              <MicropostItem key={item.id} micropost={item} onDelete={handleMicropostDeleted} />
            ))}

            {totalCount > 5 && (
              <div className="d-flex justify-content-center mt-4">
                <ReactPaginate
                  previousLabel={"Previous"}
                  nextLabel={"Next"}
                  breakLabel={"..."}
                  pageCount={Math.ceil(totalCount / 5)}
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
          <Alert variant="info">No microposts yet.</Alert>
        )}
      </Col>
    </Row>
  )
}

export default Home
