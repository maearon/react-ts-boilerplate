// Sidebar.tsx
"use client"

import { NavLink, useLocation } from "react-router-dom"
import {
  FaHome,
  FaUser,
  FaBox,
  FaShoppingCart,
  FaInfoCircle,
} from "react-icons/fa"
import "./Sidebar.css"

type SidebarProps = {
  isOpen: boolean
  onToggle: () => void
}

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const location = useLocation()

  const isActive = (pathPrefix: string) => location.pathname.startsWith(pathPrefix)

  return (
    <>
      {/* Collapse button OUTSIDE sidebar */}
      <button
        type="button"
        id="sidebarCollapse"
        className={isOpen ? "left-open" : "left-collapsed"}
        onClick={onToggle}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* <div className="wrapper"> */}
        <nav id="sidebar" className={isOpen ? "" : "collapsed"}>
          <div className="sidebar-header px-3 py-2">
            {isOpen && <h5 className="m-0">ADIDAS DASHBOARD</h5>}
          </div>

          <ul className="list-unstyled components">
            <p>{isOpen && "Management"}</p>
            <li className={isActive("/") 
              && !location.pathname.includes("users") 
              && !location.pathname.includes("products")
              && !location.pathname.includes("orders")
              && !location.pathname.includes("about") ? "active" : ""}>
              <NavLink to="/" className="dropdown-toggle">
                <FaHome className="icon" />
                {isOpen && "Admin Home"}
              </NavLink>
            </li>
            <li>
              <NavLink to="/users" className={({ isActive }) => isActive ? "active dropdown-toggle" : "dropdown-toggle"}>
                <FaUser className="icon" />
                {isOpen && "User"}
              </NavLink>
            </li>
            <li className={isActive("/products") ? "active" : ""}>
              <NavLink to="/products" className="dropdown-toggle">
                <FaBox className="icon" />
                {isOpen && "Product"}
              </NavLink>
            </li>
            <li className={isActive("/orders") ? "active" : ""}>
              <NavLink to="/orders" className="dropdown-toggle">
                <FaShoppingCart className="icon" />
                {isOpen && "Order"}
              </NavLink>
            </li>
            <li className={isActive("/about") ? "active" : ""}>
              <NavLink to="/about" className="dropdown-toggle">
                <FaInfoCircle className="icon" />
                {isOpen && "About"}
              </NavLink>
            </li>
          </ul>

          {isOpen && (
            <ul className="list-unstyled CTAs">
              <li>
                <a href="https://bootstrapious.com/tutorial/files/sidebar.zip" className="download" target="_blank" rel="noopener noreferrer">
                  Download source
                </a>
              </li>
              <li>
                <a href="https://bootstrapious.com/p/bootstrap-sidebar" className="article" target="_blank" rel="noopener noreferrer">
                  Back to article
                </a>
              </li>
              <li>
                <a href="https://ruby-rails-boilerplate-3s9t.onrender.com" className="article" target="_blank" rel="noopener noreferrer">
                  Back to shop
                </a>
              </li>
            </ul>
          )}
        </nav>
      {/* </div> */}
    </>
  )
}

export default Sidebar
