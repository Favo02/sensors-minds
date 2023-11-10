import { FC } from "react";
import Sensor from "../interfaces/Sensor";

const SensorDashboard : FC<{ sensor: Sensor }> = ({ sensor } : { sensor : Sensor}) => {

  return (
    <div>

      <h1>Sensor "{sensor.name}"</h1>

    </div>
  )
}

export default SensorDashboard
