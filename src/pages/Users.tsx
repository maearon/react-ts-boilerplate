"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card, ListGroup, Button } from "react-bootstrap"
import ReactPaginate from "react-paginate"
import { toast } from "react-toastify"
import { getUsers, deleteUser } from "@/services/userService"
import { useAuthStore } from "@/stores/authStore"
import LoadingSpinner from "@/components/UI/LoadingSpinner"
import type { User } from "@/types/user"

const Users = () => {
  const { user: currentUser } = useAuthStore()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)

  const loadUsers = async () => {
    setLoading(true)
    try {
      const response = await getUsers({ page })
      setUsers(response.users || [])
      setTotalCount(response.total_count || 0)
    } catch (error) {
      toast.error("Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [page])

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPage(selectedItem.selected + 1)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure?")) {
      try {
        const response = await deleteUser(id.toString())
        if (response.flash) {
          toast.success(response.flash[1])
          loadUsers()
        }
      } catch (error) {
        toast.error("Failed to delete user")
      }
    }
  }

  if (loading && users.length === 0) {
    return <LoadingSpinner />
  }

  return (
    <div className="container">
      <h1>All users</h1>

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
              <div className="flex-grow-1">
                <Link to={`/users/${user.id}`}>{user.name}</Link>
                {user.admin && <span className="badge bg-primary ms-2">admin</span>}
              </div>
              {currentUser?.admin && currentUser.id !== user.id && (
                <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)}>
                  Delete
                </Button>
              )}
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
    </div>
  )
}

export default Users
