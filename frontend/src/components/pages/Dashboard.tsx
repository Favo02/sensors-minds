import { FC, useEffect, useState } from "react"
import Sensor from "../../interfaces/Sensor";
import SensorDashboard from "../SensorDashboard";
import Loading from "../common/Loading";

const Dashboard : FC = () => {

  const [data, setData] = useState<Sensor | undefined>();

  useEffect(() => {
    fetch("../../../public/mockData.json", {
    // fetch("http://localhost:8080/data/plugmeter1", {
      method: "GET"
    })
      .then((response) => response.json())
      .then((data) => {
        // setData(data.data.map())
        setData(data)
        console.log(data)
      })
      .catch((error) => console.log(error));
  }, [])

  if (!data) {
    return (
      <Loading />
    )
  }

  return (
    <div>
      <SensorDashboard key={data.name} sensor={data} />
    </div>
  )
}

export default Dashboard
