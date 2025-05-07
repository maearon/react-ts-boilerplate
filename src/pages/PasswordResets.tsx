"use client"

import { useState } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { Formik, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { toast } from "react-toastify"
import { resetPassword } from "@/services/passwordResetService"
import type { PasswordResetUpdateParams } from "@/services/passwordResetService"

const PasswordResets = () => {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState<string | null>(null)

  const searchParams = new URLSearchParams(location.search)
  const email = searchParams.get("email") || ""

  const validationSchema = Yup.object({
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Password confirmation is required"),
  })

  const handleSubmit = async (
    values: { password: string; password_confirmation: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    if (!token) {
      setError("Invalid reset token")
      return
    }

    setError(null)

    const params: PasswordResetUpdateParams = {
      email,
      user: {
        password: values.password,
        password_confirmation: values.password_confirmation,
      },
    }

    try {
      const response = await resetPassword(token, params)

      if (response.flash) {
        toast.success(response.flash[1])
        navigate("/login")
      } else if (response.error) {
        setError(Array.isArray(response.error) ? response.error[0] : response.error)
      }
    } catch (error: any) {
      setError(error.message || "Password reset failed")
    } finally {
      setSubmitting(false)
    }
  }

  if (!token || !email) {
    return (
      <div className="container">
        <Alert variant="danger">Invalid password reset link</Alert>
      </div>
    )
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <Card>
          <Card.Header as="h1" className="text-center">
            Reset password
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}

            <Formik
              initialValues={{ password: "", password_confirmation: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ handleSubmit, isSubmitting, touched, errors }) => (
                <Form onSubmit={handleSubmit}>
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
                    {isSubmitting ? "Updating password..." : "Update password"}
                  </Button>
                </Form>
              )}
            </Formik>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}

export default PasswordResets
