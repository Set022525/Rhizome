import Gragh from "components/gragh"
import Recognition from "components/recognition"
import { Fragment } from "react"
import { defaultData, GraphData } from "components/gragh/data"
import { useState } from "react"

export default function App() {
  const [data, setData] = useState<GraphData>(defaultData)

  return (
    <Fragment>
      <Recognition setData={setData} />
      <Gragh data={data} />
    </Fragment>
  )
}