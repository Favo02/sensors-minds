import { FC, useEffect, useState } from "react"
import SensorDashboard from "./SensorDashboard";
import Filters from "./Filters";

const Dashboard : FC = () => {

  const [dashboards, setDashboards] = useState<string[][]>([])
  const [availableSensors, setAvailableSensors] = useState<{label : string, value : string}[]>([])

  const [start, setStart] = useState<Date>(new Date(Date.now() - 60 * 60 * 1000))
  const [end, setEnd] = useState<Date>(new Date())
  const [quantity, setQuantity] = useState<number>(30)

  useEffect(() => {
    const fetchData = async () => {
      // const initialData = await fetch("../../public/mockSensors.json");
      console.log(`http://localhost:8080/sensors?size=${quantity}`)
      const initialData = await fetch(`http://localhost:8080/sensors?start=${start.toISOString()}&end=${end.toISOString()}size=${quantity}`);
      const jsonResponse = await initialData.json()
      setAvailableSensors(jsonResponse.map((d : string) => ({label: d, value: d})))
    }

    fetchData()
  }, [])

  const addNewDashboard = () => {
    setDashboards(oldArray => [...oldArray, []])
  }

  const removeDashboard = (toRemove : number) => {
    setDashboards(dashboards.filter((_, i) => i != toRemove))
  }

  return (
    <div>
      <Filters start={start} setStart={setStart} end={end} setEnd={setEnd} quantity={quantity} setQuantity={setQuantity} />
      {dashboards.map((d, i) =>
        <SensorDashboard
        start={start} end={end} quantity={quantity}
          key={i}
          availableSensors={availableSensors}
          index={i}
          selectedSensors={d}
          setSelectedSensors={(selected : string[], ind : number) => {
            setDashboards(dashboards.map((d, i) => {
              if (ind != i) {
                return d
              }
              else {
                return selected
              }
            }))
          }}
          removeDashboard={removeDashboard}
        /> )}

      <div className="rounded-3xl mx-32 my-12 bg-gradient-to-br from-gray-100 to-gray-300 p-4 shadow-2xl drop-shadow-2xl text-center font-semibold text-xl">
        <button onClick={addNewDashboard}>Add new sensor</button>
      </div>
    </div>
  )
}

export default Dashboard
