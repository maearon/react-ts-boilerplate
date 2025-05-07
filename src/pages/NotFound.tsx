import { Link } from "react-router-dom"
import { Alert, Button } from "react-bootstrap"

const NotFound = () => {
  return (
    <div className="container text-center">
      <Alert variant="warning">
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
      </Alert>
      <Link to="/">
        <Button variant="primary">Return to Home</Button>
      </Link>
    </div>
  )
}

export default NotFound
