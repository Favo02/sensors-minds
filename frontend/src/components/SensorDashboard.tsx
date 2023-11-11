import { FC, useEffect, useState } from "react";
import Sensor from "../interfaces/Sensor";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { IoMdCloseCircle } from "react-icons/io";
import Select, { MultiValue } from 'react-select';
import { useInterval } from "./useInterval";

interface PropsInt {
  availableSensors : {label : string, value : string}[]
  index : number,
  selectedSensors : string[],
  setSelectedSensors : (sel : string[], index : number) => void
  removeDashboard : (i : number) => void,
  start : Date,
  end : Date,
  quantity : number,
}

const SensorDashboard : FC<PropsInt> = ({ availableSensors, index, selectedSensors, setSelectedSensors, removeDashboard, start, end, quantity } : PropsInt) => {

  const [tempSelected, setTempSelected] = useState<string[]>([])
  const [sensors, setSensors] = useState<Sensor[]>([])
  const colors = ["#3c6fff", "#ff0000", "#035e1b", "#d600c8"]

  const parseDate = (tick : Date) => {
    const now = new Date().getTime()
    const time = new Date(tick).getTime()

    let diff = Math.trunc((now - time) / 1000)
    let mod = "s"
    if (diff > 100) {
      diff = Math.trunc(diff / 60)
      mod = "m"
    }

    return String(`T - ${diff}${mod}`)
  }

  useEffect(() => {
    const fetchData = async (name : string) => {
      console.log("refresh")
      // const initialData = await fetch(`../../public/mockData.json`);
      const initialData = await fetch(`http://localhost:8080/data/${name}?size=${quantity}&start=${start.toISOString()}&end=${end.toISOString()}`);
      const jsonResponse = await initialData.json()
      setSensors(previousState => [...previousState, jsonResponse])
    }
    selectedSensors.forEach(name => fetchData(name))
  }, [selectedSensors]);

  useInterval(async () => {
    setSensors([])

    const fetchData = async (name : string) => {
      // const initialData = await fetch(`../../public/mockData.json`);
      const initialData = await fetch(`http://localhost:8080/data/${name}?size=${quantity}&start=${start.toISOString()}&end=${end.toISOString()}`);
      const jsonResponse = await initialData.json()
      setSensors(previousState => [...previousState, jsonResponse])
    }
    selectedSensors.forEach(name => fetchData(name))
  }, 3000)

  const handleChange = (selectedOptions : MultiValue<{ label: string; value: string }>) => {
    setTempSelected(selectedOptions.map(s => s.value))
  }

  const handleConfirm = () => {
    setSelectedSensors(tempSelected, index)
  }

  if (selectedSensors.length === 0) {
    return (
      <div key={index} className="h-[548px] rounded-3xl mx-16 mb-16 bg-gradient-to-br from-gray-100 to-gray-300 p-8 shadow-2xl drop-shadow-2xl flex flex-col items-center justify-center relative">
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
            onChange={handleChange}
          />
        </div>

        <button onClick={handleConfirm}>CONFIRM</button>
      </div>
    )
  }

  return (
    <div className="rounded-3xl mx-16 my-16 bg-white p-8 shadow-2xl drop-shadow-2xl">

      <h1 className="px-10 py-6 text-3xl font-semibold italic">{sensors.map(s => s.name).join(", ")}</h1>

      <button className="absolute top-6 right-6" onClick={() => removeDashboard(index)}>
        <IoMdCloseCircle size={30} />
      </button>

      <ResponsiveContainer width={"100%"} height={400}>
        <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            // allowDuplicatedCategory={false}
            tickFormatter={parseDate}
          />
          <YAxis />
          <Tooltip />
          {sensors.map((_, i) =>
            <Line data={sensors[i].data} key={i} type="monotone" dataKey="value" stroke={colors[i]} strokeWidth={4}  isAnimationActive={false} />
          )}
        </LineChart>
      </ResponsiveContainer>

    </div>
  )
}

export default SensorDashboard
