import { Link } from "react-router-dom"
import { Alert, Button } from "react-bootstrap"

const NotFound = () => {
  return (
    <div className="container text-center">
      <Alert variant="warning">
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
      </Alert>
      <Button as={Link} to="/" variant="primary">
        Return to Home
      </Button>
    </div>
  )
}

export default NotFound
