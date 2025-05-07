"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { Alert } from "react-bootstrap"
import { toast } from "react-toastify"
import { activateAccount } from "@/services/accountActivationService"
import LoadingSpinner from "@/components/UI/LoadingSpinner"

const AccountActivations = () => {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const activateUserAccount = async () => {
      if (!token) {
        setError("Invalid activation link")
        setLoading(false)
        return
      }

      const searchParams = new URLSearchParams(location.search)
      const email = searchParams.get("email")

      if (!email) {
        setError("Email parameter is missing")
        setLoading(false)
        return
      }

      try {
        const response = await activateAccount(token, email)

        if (response.flash) {
          toast.success(response.flash[1])
          navigate("/login")
        } else if (response.error) {
          setError(Array.isArray(response.error) ? response.error[0] : response.error)
        }
      } catch (error: any) {
        setError(error.message || "Account activation failed")
      } finally {
        setLoading(false)
      }
    }

    activateUserAccount()
  }, [token, location.search, navigate])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          {error ? (
            <Alert variant="danger">
              <h4>Activation Error</h4>
              <p>{error}</p>
            </Alert>
          ) : (
            <Alert variant="info">Processing your account activation...</Alert>
          )}
        </div>
      </div>
    </div>
  )
}

export default AccountActivations
