"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { Formik, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { toast } from "react-toastify"
import { createUser } from "@/services/userService"
import type { UserCreateParams } from "@/types/user"

const Signup = () => {
  const navigate = useNavigate()
  const [signupErrors, setSignupErrors] = useState<{ [key: string]: string[] } | null>(null)
  const [generalError, setGeneralError] = useState<string | null>(null)

  const initialValues: UserCreateParams = {
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  }

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Password confirmation is required"),
  })

  const handleSubmit = async (
    values: UserCreateParams,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    setSignupErrors(null)
    setGeneralError(null)

    try {
      const response = await createUser({ user: values })

      if (response.flash) {
        toast.success(response.flash[1])
        navigate("/")
      } else if (response.errors) {
        setSignupErrors(response.errors)
      } else if (response.error) {
        setGeneralError(Array.isArray(response.error) ? response.error[0] : response.error)
      }
    } catch (error: any) {
      if (error.errors) {
        setSignupErrors(error.errors)
      } else if (error.error) {
        setGeneralError(Array.isArray(error.error) ? error.error[0] : error.error)
      } else {
        setGeneralError("An error occurred during signup. Please try again.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <Card>
          <Card.Header as="h1" className="text-center">
            Sign up
          </Card.Header>
          <Card.Body>
            {generalError && <Alert variant="danger">{generalError}</Alert>}

            {signupErrors && Object.keys(signupErrors).length > 0 && (
              <Alert variant="danger">
                <ul className="mb-0">
                  {Object.entries(signupErrors).map(([field, errors]) =>
                    errors.map((error, index) => (
                      <li key={`${field}-${index}`}>
                        {field.charAt(0).toUpperCase() + field.slice(1)} {error}
                      </li>
                    )),
                  )}
                </ul>
              </Alert>
            )}

            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
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
                    <ErrorMessage name="name" component={Form.Control.Feedback} />
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
                    <ErrorMessage name="email" component={Form.Control.Feedback} />
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
                    <ErrorMessage name="password" component={Form.Control.Feedback} />
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
                    <ErrorMessage name="password_confirmation" component={Form.Control.Feedback} />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100" disabled={isSubmitting}>
                    {isSubmitting ? "Creating account..." : "Create my account"}
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

export default Signup
