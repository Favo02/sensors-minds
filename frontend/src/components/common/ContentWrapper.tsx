import type { FC } from "react"
import { Outlet } from "react-router-dom"
import Header from "./Header"

const ContentWrapper : FC = () => {
  return (
    <>
      <Header />

      <div className="w-10/12 m-auto h-screen border-2 border-customblue/25 rounded-lg bg-gradient-to-br from-white to-customblue/25">
        <Outlet />
      </div>
    </>
  )
}

export default ContentWrapper
