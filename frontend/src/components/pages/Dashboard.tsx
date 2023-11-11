import { FC, useEffect, useState } from "react"
import Sensor from "../../interfaces/Sensor";
import SensorDashboard from "../SensorDashboard";

const Dashboard : FC = () => {

  const [dashboards, setDashboards] = useState<(Sensor | undefined)[]>([])
  const [availableSensors, setAvailableSensors] = useState<{label : string, value : string}[]>([])

  useEffect(() => {
    fetch("../../../public/mockSensors.json", {
    // fetch("http://localhost:8080/sensors", {
      method: "GET"
    })
      .then((response) => response.json())
      .then((data) => {
        setAvailableSensors(data.map((d : string) => ({label: d, value: d})))
      })
      .catch((error) => console.log(error))

  }, [])

  const addNewDashboard = () => {
    setDashboards(oldArray => [...oldArray, undefined])
  }

  const removeDashboard = (toRemove : number) => {
    setDashboards(dashboards.filter((_, i) => i != toRemove))
  }

  return (
    <div>
      {dashboards.map((d, i) => <SensorDashboard key={i} availableSensors={availableSensors} index={i} sensors={d} removeDashboard={removeDashboard} /> )}

      <div className="rounded-3xl mx-32 mb-12 bg-gradient-to-br from-gray-100 to-gray-300 p-4 shadow-2xl drop-shadow-2xl text-center font-semibold text-xl">
        <button onClick={addNewDashboard}>Add new sensor</button>
      </div>
    </div>
  )
}

export default Dashboard
