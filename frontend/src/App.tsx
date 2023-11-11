import type { FC } from "react"
import { useEffect, useState } from "react"
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import Loading from "./components/common/Loading"
import ContentWrapper from "./components/common/ContentWrapper"
import Dashboard from "./components/Dashboard"
import Upload from "./components/Upload"

const router = createBrowserRouter([
  {
    path: "/",
    element: <ContentWrapper />,
    errorElement: <Navigate to="/dashboard" replace />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "upload", element: <Upload /> },
    ]
  }
])

const App : FC = () => {

  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <Loading />
      </div>
    )
  }

  return (
    <RouterProvider router={router} />
  )
}

export default App
