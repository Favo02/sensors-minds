import type { FC } from "react"
import { useEffect, useState } from "react"
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import Loading from "./components/common/Loading"

const router = createBrowserRouter([
  {
    path: "/",
    // element: , // each page will get this
    errorElement: <Navigate to="/dashboard" replace />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <h1>home dashboard</h1> },
      { path: "add", element: <h1>add</h1> },
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
