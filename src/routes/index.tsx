import type React from "react"
import { lazy, Suspense } from "react"
import type { RouteObject } from "react-router-dom"
import Layout from "@/components/Layout/Layout"
import ProtectedRoute from "@/components/Auth/ProtectedRoute"
import LoadingSpinner from "@/components/UI/LoadingSpinner"

// Lazy load components
const Home = lazy(() => import("@/pages/Home"))
const Login = lazy(() => import("@/pages/Login"))
const Signup = lazy(() => import("@/pages/Signup"))
const About = lazy(() => import("@/pages/About"))
const Contact = lazy(() => import("@/pages/Contact"))
const Users = lazy(() => import("@/pages/Users"))
const UserProfile = lazy(() => import("@/pages/UserProfile"))
const UserEdit = lazy(() => import("@/pages/UserEdit"))
const ShowFollow = lazy(() => import("@/pages/ShowFollow"))
const AccountActivations = lazy(() => import("@/pages/AccountActivations"))
const AccountActivationsNew = lazy(() => import("@/pages/AccountActivationsNew"))
const PasswordResetsNew = lazy(() => import("@/pages/PasswordResetsNew"))
const PasswordResets = lazy(() => import("@/pages/PasswordResets"))
const NotFound = lazy(() => import("@/pages/NotFound"))

// Wrap lazy-loaded components with Suspense
const withSuspense = (Component: React.ComponentType<any>) => (
  <Suspense fallback={<LoadingSpinner />}>
    <Component />
  </Suspense>
)

// Define routes
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: withSuspense(Home) },
      { path: "login", element: withSuspense(Login) },
      { path: "signup", element: withSuspense(Signup) },
      { path: "about", element: withSuspense(About) },
      { path: "contact", element: withSuspense(Contact) },
      { path: "users", element: withSuspense(Users) },
      { path: "users/:id", element: withSuspense(UserProfile) },
      {
        path: "users/:id/edit",
        element: <ProtectedRoute>{withSuspense(UserEdit)}</ProtectedRoute>,
      },
      {
        path: "users/:id/following",
        element: withSuspense(() => <ShowFollow type="following" />),
      },
      {
        path: "users/:id/followers",
        element: withSuspense(() => <ShowFollow type="followers" />),
      },
      { path: "account_activations/:token/edit", element: withSuspense(AccountActivations) },
      { path: "account_activations/new", element: withSuspense(AccountActivationsNew) },
      { path: "password_resets/new", element: withSuspense(PasswordResetsNew) },
      { path: "password_resets/:token", element: withSuspense(PasswordResets) },
      { path: "*", element: withSuspense(NotFound) },
    ],
  },
]
