import type { FC } from "react"
import { Outlet } from "react-router-dom"
import Header from "./Header"

const ContentWrapper : FC = () => {
  return (
    <>
      <Header />

      <div className="w-10/12 m-auto h-full border-2 border-customblue/25 rounded-3xl bg-customblue shadow-2xl drop-shadow-2xl">
        <Outlet />
      </div>
    </>
  )
}

export default ContentWrapper
