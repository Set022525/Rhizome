import Gragh from "components/gragh"
import Recognition from "components/recognition"
import { Fragment } from "react"
import { defaultData, GraghLink, GraghNode, GraphData, sampleData } from "components/gragh/data"
import { useEffect, useState } from "react"

export default function App() {
  const [interimText, setInterimText] = useState<string>("")
  const [finalText, setFinalText] = useState<string>("")
  const [count, setCount] = useState<number>(0)
  const [group, setGroup] = useState<number>(0)
  const [data, setData] = useState<GraphData>(defaultData)
  const [nodes, setNodes] = useState<GraghNode[]>([])
  const [links, setLinks] = useState<GraghLink[]>([])

  const sendBuff = async (buff: string) => {
    // bufferをDBに送る処理
  }

  useEffect(() => {
    if (finalText.length - count > 50) {
      const buffer = finalText.substring(count)
      setCount(finalText.length)
      sendBuff(buffer)
    }
  },[finalText])

  useEffect(() => {
    setNodes([])
    setLinks([])
    sampleData.nodes.map((node) => {
      setNodes(old => [...old, node])
    })
    sampleData.links.map((link) => {
      setLinks(old => [...old, link])
    })
  },[])

  useEffect(() => {
    const data_: GraphData = {
      nodes: nodes,
      links: links,
    }
    setData(data_)
  }, [nodes, links])

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