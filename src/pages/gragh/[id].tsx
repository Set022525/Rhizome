import axios from "axios"
import Gragh from "components/gragh"
import { GraghLink, GraghNode, GraphData } from "components/gragh/data"
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"

type GraghPageProps = {
  data: GraphData
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<GraghPageProps>> => {
  const { id } = context.query
  if (id) {
    const res = await axios.get(`https://rhizome-nlp-7rno4vadcq-an.a.run.app?id=${id}`).catch(
      (error) => {
        console.log("get error", error)
        return
      }
    )
    console.log("res", res)
    if (res && res.data.nodes != "[]") {
      const raw = res.data
      console.log("raw", raw)
      const nodes: GraghNode[] = JSON.parse(raw.nodes)
      const links: GraghLink[] = JSON.parse(raw.links)
      const data_: GraphData = {nodes, links}
      console.log("data", data_)
      return { props: { data: data_}}
    } else {
      return { notFound: true }
    }
  } else {
    return { notFound: true }
  }
}

const GraghPage: NextPage<GraghPageProps> = ( props ) => {
  return (
    <Gragh data={props.data} />
  )
}

export default GraghPage