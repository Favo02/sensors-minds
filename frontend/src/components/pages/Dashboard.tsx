import { FC, useState } from "react"
import Sensor from "../../interfaces/Sensor";
import SensorDashboard from "../SensorDashboard";
import { IoMdCloseCircle } from "react-icons/io"

const Dashboard : FC = () => {

  const [dashboards, setDashboards] = useState<(Sensor | undefined)[]>([])

  // useEffect(() => {
  //   fetch("../../../public/mockData.json", {
  //   // fetch("http://localhost:8080/data/plugmeter1", {
  //     method: "GET"
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       // setData(data.data.map())
  //       setData(data)
  //       console.log(data)
  //     })
  //     .catch((error) => console.log(error));
  // }, [])

  const addNewDashboard = () => {
    setDashboards(oldArray => [...oldArray, undefined])
  }

  const removeDashboard = (toRemove : number) => {
    setDashboards(dashboards.filter((d, i) => i != toRemove))
  }

  return (
    <div>
      {dashboards.map((d, i) => {
        if (!d) {
          return (
            <div key={i} className="h-[500px] rounded-3xl mx-16 my-16 bg-gradient-to-br from-gray-100 to-gray-300 p-8 shadow-2xl drop-shadow-2xl flex items-center justify-center relative">
              <button className="absolute top-6 right-6" onClick={() => removeDashboard(i)}>
                <IoMdCloseCircle size={30} />
              </button>
              <h1 className="text-2xl font-semibold">No sensor selected</h1>
            </div>
          )
        }

        return (
          <SensorDashboard key={i} sensor={d} />
        )
      })}

      <div className="rounded-3xl mx-32 mb-12 bg-gradient-to-br from-gray-100 to-gray-300 p-4 shadow-2xl drop-shadow-2xl text-center font-semibold text-xl">
        <button onClick={addNewDashboard}>Add new sensor</button>
      </div>
    </div>
  )
}

export default Dashboard
