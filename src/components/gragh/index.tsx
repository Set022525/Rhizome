import { Box } from "@mui/material"
import { defaultNode, GraphData, MyNodeObject } from "components/gragh/data"
import loadable from '@loadable/component'
import { useEffect, useRef, useState } from "react"
import SpriteText from "three-spritetext"
import Detail from "./detail"

// const ForceGraph2D = loadable(() => import("./forceGragh2d"))
const ForceGraph3D = loadable(() => import("./forceGragh3d"))
// const ForceGraphVR = loadable(() => import("./forceGraghVr"))

type GraghProps = {
  data: GraphData
}

export default function Gragh( {data}: GraghProps ) {
  // const [graghType , setGraghType] = useState<number>(1)
  const [detailOpen, setDetailOpen] = useState<boolean>(false)
  const [node, setNode] = useState<MyNodeObject>(defaultNode)
  const graghRef = useRef<any>(!null)

  const handleNodeClick = (node: MyNodeObject, event: MouseEvent) => {
    setNode(node)
    setDetailOpen(true)
  }

  useEffect(() => {
    if (graghRef && node.x && node.y && node.z) {
      const distance = 300
      const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z)

      graghRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
        node, // lookAt ({ x, y, z })
        1000  // ms transition duration
      )
    }
  },[node])

  return (
    <Box mt="-40px">
      {/* <Box sx={{position: "fixed", top: "30px", left: "50%", transform: "translate(-50%, 0%)", zIndex: 9999, display: "flex", justifyContent: "center"}}>
        <Button onClick={() => setGraghType(0)}><Typography color="white.main" fontWeight="bold">2D</Typography></Button>
        <Button onClick={() => setGraghType(1)}><Typography color="white.main" fontWeight="bold">3D</Typography></Button>
        <Button onClick={() => setGraghType(2)}><Typography color="white.main" fontWeight="bold">VR</Typography></Button>
      </Box> */}
      <Box>
        <Detail open={detailOpen} setOpen={setDetailOpen} node={node} nodes={data.nodes} links={data.links} setNode={setNode} />
      </Box>
      <Box>
        <ForceGraph3D
          graphData={data}
          nodeAutoColorBy="group"
          nodeThreeObject={(node: MyNodeObject) => {
            const sprite = new SpriteText((typeof node.id == "string") ? node.id : "")
            sprite.color = node.color ? node.color : ""
            sprite.textHeight = 8
            sprite.fontSize = 90
            sprite.fontWeight = "bold"
            return sprite
          }}
          onNodeClick={handleNodeClick}
          ref={graghRef}
        />
        {/* {graghType == 0 ? (
          <ForceGraph2D
            graphData={data}
            nodeLabel="id"
            nodeAutoColorBy="group"
            nodeCanvasObjectMode={() => 'after'}
            nodeCanvasObject={(node: MyNodeObject, ctx, globalScale) => {
              if (node.x && node.y) {
                const label = node.id as string
                const fontSize = 12 / globalScale
                ctx.font = `${fontSize}px Sans-Serif`
                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'
                ctx.fillStyle = `${node.color}`
                ctx.fillText(label, node.x, node.y + 6)
              }
            }}
            backgroundColor="black"
          />
        ):(
          <Fragment>
            {graghType == 1 ? (
              <ForceGraph3D
                graphData={data}
                nodeAutoColorBy="group"
                nodeThreeObject={(node: MyNodeObject) => {
                  const sprite = new SpriteText((typeof node.id == "string") ? node.id : "")
                  sprite.color = node.color ? node.color : ""
                  sprite.textHeight = 8
                  sprite.fontSize = 90
                  sprite.fontWeight = "bold"
                  return sprite
                }}
                onNodeClick={handleNodeClick}
              />
            ):(
              <ForceGraphVR
                graphData={data}
                nodeLabel="id"
                nodeAutoColorBy="group"
              />
            )}
          </Fragment>
        )} */}
      </Box>
    </Box>
  )
}