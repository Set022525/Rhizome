import Gragh from "components/gragh"
import Recognition from "components/recognition"
import { Fragment } from "react"
import { defaultData, GraghLink, GraghNode, GraphData } from "components/gragh/data"
import { useEffect, useState } from "react"
import axios from "axios"

export default function App() {
  const [interimText, setInterimText] = useState<string>("")
  const [finalText, setFinalText] = useState<string>("")
  const [data, setData] = useState<GraphData>(defaultData)

  useEffect(() => {
    setTimeout( async () => {
      const res = await axios.get("https://nlp-7rno4vadcq-uc.a.run.app").catch(
        (error) => {
          console.log("get error", error)
          return
        }
      )
      if (res) {
        const data_: GraphData = res.data
        setData(data_)
      }
    }, 10*1000)
  },[])

  return (
    <Fragment>
      <Recognition
        interimText={interimText}
        setInterimText={setInterimText}
        finalText={finalText}
        setFinalText={setFinalText}
      />
      <Gragh data={data}/>
    </Fragment>
  )
}