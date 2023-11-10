import { FC, useEffect, useState } from "react"
import Sensor from "../../interfaces/Sensor";
import SensorDashboard from "../SensorDashboard";

const Dashboard : FC = () => {

  const [data, setData] = useState<Sensor[] | []>([]);

  useEffect(() => (
    // TODO: fetch
    setData([
      {
        name: "Sensore 1",
        type: "W",
        start: new Date(new Date().setDate(new Date().getDate() - 5)),
        end: new Date(),
        data: [
          { timestamp: new Date(), value: 8 },
          { timestamp: new Date(), value: 8 },
          { timestamp: new Date(), value: 27 },
          { timestamp: new Date(), value: 1 },
          { timestamp: new Date(), value: 18 },
          { timestamp: new Date(), value: 9 }
        ]
      },
      {
        name: "Sensore 2",
        type: "W",
        start: new Date(new Date().setDate(new Date().getDate() - 5)),
        end: new Date(),
        data: [
          { timestamp: new Date(), value: 8 },
          { timestamp: new Date(), value: 8 },
          { timestamp: new Date(), value: 27 },
          { timestamp: new Date(), value: 1 },
          { timestamp: new Date(), value: 18 },
          { timestamp: new Date(), value: 9 }
        ]
      }
    ])
  ), [])

  return (
    <div className="background-white">
      {data.map(s => <SensorDashboard key={s.name} sensor={s} />)}
    </div>
  )
}

export default Dashboard
