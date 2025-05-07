"use client"

import { useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { Formik, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { requestPasswordReset } from "@/services/passwordResetService"

const PasswordResetsNew = () => {
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
  })

  const handleSubmit = async (
    values: { email: string },
    { setSubmitting, resetForm }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void },
  ) => {
    setError(null)
    setSuccess(null)

    try {
      const response = await requestPasswordReset(values.email)

      if (response.flash) {
        setSuccess(response.flash[1])
        resetForm()
      }
    } catch (error: any) {
      setError(error.message || "Failed to request password reset")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <Card>
          <Card.Header as="h1" className="text-center">
            Forgot password
          </Card.Header>
          <Card.Body>
            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Formik initialValues={{ email: "" }} validationSchema={validationSchema} onSubmit={handleSubmit}>
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
                    <ErrorMessage name="email" component={Form.Control.Feedback} />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit"}
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

export default PasswordResetsNew
