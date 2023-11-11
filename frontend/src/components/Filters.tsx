import { FC, useState } from "react"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-widgets/styles.css";
import NumberPicker from "react-widgets/NumberPicker";

interface PropsInt {
  start : Date,
  setStart : (d : Date) => void,
  end : Date,
  setEnd : (d : Date) => void,
  realtime : boolean,
  setRealtime : (b : boolean) => void,
  quantity : number,
  setQuantity : (q : number) => void
}

const Filters : FC<PropsInt> = ({start, setStart, end, setEnd, realtime, setRealtime, quantity, setQuantity} : PropsInt) => {
  const [shown, setShown] = useState<boolean>(false)

  if (shown) {
    return (
      <div className="w-full p-4 ">
        <div className="w-full p-4 text-center text-xl font-bold italic cursor-pointer" onClick={() => setShown(!shown)}>
          Hide filters
        </div>

        <div className="text-center flex justify-center items-center p-4 pt-0">

          Realtime:
          <input
            type="checkbox"
            className="p-2 m-2 h-6 w-6"
            checked={realtime}
            onChange={() => setRealtime(!realtime)}
          />

          Max measurements:
          <NumberPicker
            className="inline px-4"
            value={quantity}
            onChange={value => setQuantity(value)}
          />
        </div>

        <div className="flex justify-center items-center p-4 pt-0">
          From:
          <DatePicker selected={start} onChange={(date) => setStart(date)} wrapperClassName="text-center px-4" />

          To:
          <DatePicker selected={end} onChange={(date) => setEnd(date)} wrapperClassName="text-center px-4" />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full p-4 text-center text-xl font-bold italic cursor-pointer" onClick={() => setShown(!shown)}>
      Show filters
    </div>
  )

}

export default Filters
