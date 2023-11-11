import { FC } from "react";
import Sensor from "../interfaces/Sensor";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { IoMdCloseCircle } from "react-icons/io";
import Select from 'react-select';

interface PropsInt {
  availableSensors : {label : string, value : string}[]
  index : number,
  sensors : undefined | Sensor,
  removeDashboard : (i : number) => void
}

const SensorDashboard : FC<PropsInt> = ({ availableSensors, index, sensors, removeDashboard } : PropsInt) => {

  if (!sensors) {
    return (
      <div key={index} className="h-[500px] rounded-3xl mx-16 my-16 bg-gradient-to-br from-gray-100 to-gray-300 p-8 shadow-2xl drop-shadow-2xl flex flex-col items-center justify-center relative">
        <button className="absolute top-6 right-6" onClick={() => removeDashboard(index)}>
          <IoMdCloseCircle size={30} />
        </button>
        <h1 className="text-2xl font-semibold">No sensor selected</h1>

        <div className="w-1/2 mt-4">
          <Select
            isMulti
            name="colors"
            placeholder="Select one or more sensors"
            options={availableSensors}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-3xl mx-16 my-16 bg-white p-8 shadow-2xl drop-shadow-2xl">

      <h1 className="px-10 py-6 text-3xl font-semibold italic">Sensor "{sensors.name}"</h1>

      <ResponsiveContainer width={"100%"} height={400}>
        <LineChart data={sensors.data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
