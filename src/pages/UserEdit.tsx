"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Form, Button, Card, Alert, Row, Col } from "react-bootstrap"
import { Formik, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { toast } from "react-toastify"
import { editUser, updateUser } from "@/services/userService"
import { useAuthStore } from "@/stores/authStore"
import LoadingSpinner from "@/components/UI/LoadingSpinner"
import type { UserUpdateParams } from "@/types/user"

const UserEdit = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user: currentUser } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<{ name: string; email: string }>({ name: "", email: "" })
  const [gravatar, setGravatar] = useState("")
  const [updateErrors, setUpdateErrors] = useState<{ [key: string]: string[] } | null>(null)
  const [generalError, setGeneralError] = useState<string | null>(null)

  useEffect(() => {
    const loadUserData = async () => {
      if (!id) return

      try {
        const response = await editUser(id)
        setUserData({
          name: response.user.name,
          email: response.user.email,
        })
        setGravatar(response.gravatar)
      } catch (error) {
        toast.error("Failed to load user data")
        navigate("/")
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [id, navigate])

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters"),
    password_confirmation: Yup.string().oneOf([Yup.ref("password")], "Passwords must match"),
  })

  const handleSubmit = async (
    values: UserUpdateParams,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    if (!id) return

    setUpdateErrors(null)
    setGeneralError(null)

    try {
      const response = await updateUser(id, { user: values })

      if (response.flash_success) {
        toast.success(response.flash_success[1])
        navigate(`/users/${id}`)
      } else if (response.error) {
        setGeneralError(Array.isArray(response.error) ? response.error[0] : response.error)
      }
    } catch (error: any) {
      if (error.errors) {
        setUpdateErrors(error.errors)
      } else if (error.error) {
        setGeneralError(Array.isArray(error.error) ? error.error[0] : error.error)
      } else {
        setGeneralError("An error occurred while updating your profile. Please try again.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  // Check if the current user is authorized to edit this profile
  if (currentUser?.id.toString() !== id && !currentUser?.admin) {
    navigate("/")
    return null
  }

  return (
    <div className="container">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Header as="h1" className="text-center">
              Update your profile
            </Card.Header>
            <Card.Body>
              {generalError && <Alert variant="danger">{generalError}</Alert>}

              {updateErrors && Object.keys(updateErrors).length > 0 && (
                <Alert variant="danger">
                  <ul className="mb-0">
                    {Object.entries(updateErrors).map(([field, errors]) =>
                      errors.map((error, index) => (
                        <li key={`${field}-${index}`}>
                          {field.charAt(0).toUpperCase() + field.slice(1)} {error}
                        </li>
                      )),
                    )}
                  </ul>
                </Alert>
              )}

              <div className="text-center mb-4">
                <img
                  src={`https://secure.gravatar.com/avatar/${gravatar}?s=80`}
                  alt="Gravatar"
                  className="rounded-circle"
                  width="80"
                  height="80"
                />
              </div>

              <Formik
                initialValues={{
                  name: userData.name,
                  email: userData.email,
                  password: "",
                  password_confirmation: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ handleSubmit, isSubmitting, touched, errors }) => (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="name">Name</Form.Label>
                      <Field
                        as={Form.Control}
                        type="text"
                        name="name"
                        id="name"
                        isInvalid={touched.name && !!errors.name}
                      />
                      <ErrorMessage name="name" component={Form.Control.Feedback} type="invalid" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="email">Email</Form.Label>
                      <Field
                        as={Form.Control}
                        type="email"
                        name="email"
                        id="email"
                        isInvalid={touched.email && !!errors.email}
                      />
                      <ErrorMessage name="email" component={Form.Control.Feedback} type="invalid" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="password">Password</Form.Label>
                      <Field
                        as={Form.Control}
                        type="password"
                        name="password"
                        id="password"
                        isInvalid={touched.password && !!errors.password}
                      />
                      <ErrorMessage name="password" component={Form.Control.Feedback} type="invalid" />
                      <Form.Text className="text-muted">Leave blank if you don't want to change it</Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="password_confirmation">Confirm Password</Form.Label>
                      <Field
                        as={Form.Control}
                        type="password"
                        name="password_confirmation"
                        id="password_confirmation"
                        isInvalid={touched.password_confirmation && !!errors.password_confirmation}
                      />
                      <ErrorMessage name="password_confirmation" component={Form.Control.Feedback} type="invalid" />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100" disabled={isSubmitting}>
                      {isSubmitting ? "Saving changes..." : "Save changes"}
                    </Button>
                  </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default UserEdit
