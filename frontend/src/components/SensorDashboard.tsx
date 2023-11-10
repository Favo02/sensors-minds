import { FC } from "react";
import Sensor from "../interfaces/Sensor";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const SensorDashboard : FC<{ sensor: Sensor }> = ({ sensor } : { sensor : Sensor}) => {

  return (
    <div>

      <h1>Sensor "{sensor.name}"</h1>

      <LineChart width={730} height={250} data={sensor.data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
      </LineChart>

    </div>
  )
}

export default SensorDashboard
