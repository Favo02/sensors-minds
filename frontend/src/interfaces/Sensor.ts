import SensorData from "./SensorData"

interface Sensor {
  name : string,
  type : string,
  start : Date,
  end : Date,
  data : SensorData[]
}

export default Sensor
