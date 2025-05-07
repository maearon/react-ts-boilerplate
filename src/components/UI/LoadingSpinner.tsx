import type React from "react"

interface LoadingSpinnerProps {
  fullPage?: boolean
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ fullPage = false }) => {
  const spinner = (
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  )

  if (fullPage) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        {spinner}
      </div>
    )
  }

  return <div className="text-center py-4">{spinner}</div>
}

export default LoadingSpinner
