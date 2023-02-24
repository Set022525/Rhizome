import { Box, Button, Typography } from '@mui/material'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { GraghLink, GraghNode, MyNodeObject } from './data'

type Props = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  node: MyNodeObject
  nodes: GraghNode[]
  links: GraghLink[]
  setNode: Dispatch<SetStateAction<MyNodeObject>>
}

export default function Detail( {open, setOpen, node, nodes, links, setNode}: Props ) {
  const [ neighbors, setNeighbors ] = useState<MyNodeObject[]>([])

  useEffect(() => {
    setNeighbors([])
    links.map((link) => {
      if ((typeof link.source != "string") && (link.source.id == node.id)) {
        setNeighbors((old) => typeof link.target != "string" ? [...old, link.target] : [...old])
      } else if ((typeof link.target != "string") && (link.target.id == node.id)) {
        setNeighbors((old) => typeof link.source != "string" ? [...old, link.source]: [...old])
      }
    })
  },[node, nodes, links])

  const handleNeighborClick = (neighbor: MyNodeObject) => {
    setNode(neighbor)
  }

  const toggleDrawer = (open_: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return
      }
      setOpen(open_)
    }

  return (
    <div>
      <SwipeableDrawer
        anchor={"right"}
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <Box sx={{width: "400px", p: 4, zIndex: 99999}}>
          <Typography variant="h4" fontWeight="bold">{node.id ? node.id : "キーワード"}</Typography>
          <Box sx={{width: "100%", height: "5px", mb: 4}} bgcolor={node.color ? node.color : "black.main"}></Box>
          <Typography variant="h6" fontWeight="bold" mb={1}>会話の内容</Typography>
          {node.texts ? (node.texts.map((t) => <Typography variant="body2" color="text.main" mb={2} key={t}>{t}</Typography>)) : <Typography variant="body2" color="text.main" mb={2}>結果がありません</Typography>}
          <Typography variant="h6" fontWeight="bold" mt={2} mb={1}>関連キーワード</Typography>
          <Box sx={{display: "flex", flexDirection: "row", flexWrap: "wrap"}}>
            {neighbors.map((neighbor) => {
              return (
                <Box key={neighbor.id} sx={{m: 1}}>
                  <Button variant="contained" color="secondary" sx={{bgcolor: `${neighbor.color}`}} onClick={() => handleNeighborClick(neighbor)}>
                    <Typography fontWeight="bold">{neighbor.id}</Typography>
                  </Button>
                </Box>
              )
            })}
          </Box>
        </Box>
      </SwipeableDrawer>
    </div>
  );
}
