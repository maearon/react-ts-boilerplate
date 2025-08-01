import type React from "react"
import { Link } from "react-router-dom"

const Footer: React.FC = () => {
  return (
    <footer className="footer mt-auto py-3 bg-light">
      <div className="container text-center">
        <small>
          The{" "}
          <a href="https://react.dev/" target="_blank" rel="noopener noreferrer">
            Adidas Dashboard
          </a>{" "}
          by{" "}
          <a href="https://github.com/maearon" target="_blank" rel="noopener noreferrer">
            maearon
          </a>
        </small>
        <nav className="mt-3">
          <ul className="list-inline">
            <li className="list-inline-item">
              <Link to="/about">About</Link>
            </li>
            <li className="list-inline-item">
              <Link to="/contact">Contact</Link>
            </li>
            <li className="list-inline-item">
              <a href="https://react.dev/blog" target="_blank" rel="noopener noreferrer">
                News
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}

export default Footer
