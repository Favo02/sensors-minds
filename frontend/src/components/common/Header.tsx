import { FC } from "react"
import logo from '../../assets/horizontal-logo.png'
import { Link } from "react-router-dom"

const Loading : FC = () => {

  return (
    <div className="px-24 py-6 flex justify-between top-0 w-full">
      <Link className="ml-12" to={"/dashboard"}>
        <img src={logo} className="h-20" />
      </Link>
      <Link className="h-full flex justify-center align-middle pt-9 font-semibold italic text-lg text-black/40 hover:text-black transition-all" to={"/upload"}>
        FROM EXTERNAL SOURCE
      </Link>
    </div>

  )
}

export default Loading
