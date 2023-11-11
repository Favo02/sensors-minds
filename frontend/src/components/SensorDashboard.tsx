import { FC } from "react";
import Sensor from "../interfaces/Sensor";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SensorDashboard : FC<{ sensor: Sensor }> = ({ sensor } : { sensor : Sensor}) => {

  return (
    <div className="rounded-3xl mx-16 my-16 bg-white pb-8">

      <h1 className="px-10 py-6 text-3xl font-semibold italic">Sensor "{sensor.name}"</h1>

      {/* <ResponsiveContainer width={"100%"} aspect={1}> */}
      <ResponsiveContainer width={"100%"} height={400}>
        <LineChart data={sensor.data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#3c6fff" strokeWidth={4} />
        </LineChart>
      </ResponsiveContainer>


    </div>
  )
}

export default SensorDashboard
