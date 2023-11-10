import { FC, useEffect, useState } from "react"

const Dashboard : FC = () => {

  const [data, setData] = useState<unknown[] | []>([]);

  useEffect(() => (
    // TODO: fetch
    setData(["ciao", "due"])
  ), [])


  return (
    <div className="background-white">
      {JSON.stringify(data)}
    </div>
  )
}

export default Dashboard
