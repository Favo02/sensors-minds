import { FC } from "react"
import logo from '../../assets/horizontal-logo.png'

const Loading : FC = () => {

  return (
    <div className="px-24 py-6 flex justify-between top-0 w-full">
      <div className="ml-6">
        <img src={logo} className="h-16" />
      </div>
      {/* <div className="h-full flex justify-center align-middle">
        ADMIN
      </div> */}
    </div>

  )
}

export default Loading
