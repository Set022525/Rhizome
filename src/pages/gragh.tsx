import { NextPage } from "next"
import Gragh from "components/gragh"
import { defaultData, GraghLink, GraghNode, GraphData, sampleData } from "components/gragh/data"
import { useEffect, useState } from "react"

const GraghPage: NextPage = () => {
  const [data, setData] = useState<GraphData>(defaultData)
  const [nodes, setNodes] = useState<GraghNode[]>([])
  const [links, setLinks] = useState<GraghLink[]>([])

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

  return ( <Gragh data={data} /> )
}

export default GraghPage