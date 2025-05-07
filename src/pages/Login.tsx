"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { Formik, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { toast } from "react-toastify"
import { useAuthStore } from "@/stores/authStore"
import type { LoginCredentials } from "@/types/auth"

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuthStore()
  const [loginError, setLoginError] = useState<string | null>(null)

  const from = location.state?.from?.pathname || "/"

  const initialValues: LoginCredentials = {
    email: "",
    password: "",
    remember_me: false,
  }

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().required("Password is required"),
  })

  const handleSubmit = async (
    values: LoginCredentials,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    setLoginError(null)
    try {
      await login(values)
      toast.success("Logged in successfully")
      navigate(from, { replace: true })
    } catch (error: any) {
      if (error.error) {
        setLoginError(Array.isArray(error.error) ? error.error[0] : error.error)
      } else {
        setLoginError("Invalid email/password combination")
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
            Log in
          </Card.Header>
          <Card.Body>
            {loginError && <Alert variant="danger">{loginError}</Alert>}

            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
              {({ handleSubmit, isSubmitting, touched, errors }) => (
                <Form onSubmit={handleSubmit}>
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
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Check type="checkbox" id="remember_me">
                      <Field as={Form.Check.Input} type="checkbox" name="remember_me" />
                      <Form.Check.Label>Remember me on this computer</Form.Check.Label>
                    </Form.Check>
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100" disabled={isSubmitting}>
                    {isSubmitting ? "Logging in..." : "Log in"}
                  </Button>
                </Form>
              )}
            </Formik>

            <div className="mt-3">
              <p>
                New user? <Link to="/signup">Sign up now!</Link>
              </p>
              <p>
                <Link to="/password_resets/new">Forgot password?</Link>
              </p>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}

export default Login
