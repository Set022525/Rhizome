import { Box, Card, Container, IconButton, Tooltip, Typography } from "@mui/material"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition"
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import { database } from "libs/firebase/firebase"
import { pushByRefDB, updateByQueryDB } from "libs/firebase/query"
import axios from "axios"
import { GraghLink, GraghNode, GraphData } from "components/gragh/data"
import { v4 as uuidv4 } from "uuid"
import AddIcon from '@mui/icons-material/Add'
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';

type PostData = {
  group: number
  contents: string[]
}

type Props = {
  setData: Dispatch<SetStateAction<GraphData>>
}

export default function Recognition( {setData}: Props ) {
  const { interimTranscript, finalTranscript, listening, resetTranscript } = useSpeechRecognition()
  const [interimText, setInterimText] = useState<string>("")
  const [finalText, setFinalText] = useState<string>("")
  const [ group, setGroup ] = useState<number>(0)
  const [ context, setContext ] = useState<number>(0)
  const [ preText, setPreText] = useState<string>("") //一つ前のグループまでのfinalText
  const [ groupText, setGroupText] = useState<string>("")
  const [ preText_, setPreText_] = useState<string>("") //一つ前のcontextまでのtext
  const [ textCount, setTextCount ] = useState<number>(0)
  const [ contents, setContents ] = useState<string[]>([])
  const [ id, setId ] = useState<string>("")
  const db = database

  const getData = async () => {
    console.log("start")
    console.log("id", id)
    if (id) {
      const res = await axios.get(`https://rhizome-nlp-7rno4vadcq-an.a.run.app?id=${id}`).catch(
        (error) => {
          console.log("get error", error)
          return
        }
      )
      console.log("res", res)
      if (res && res.data.nodes != "{}") {
        const raw = res.data
        const nodes: GraghNode[] = JSON.parse(raw.nodes)
        const links: GraghLink[] = JSON.parse(raw.links)
        const data_: GraphData = {nodes, links}
        console.log("data", data_)
        setData(data_)
      }
    }
  }

  useEffect(() => {
    setId(uuidv4())
  },[])

  useEffect(() => {
    setInterimText(interimTranscript)
    const textArea = document.getElementById("text-area")
    if (textArea) {
      textArea.scrollTop = textArea.scrollHeight
    }
  }, [interimTranscript])

  useEffect(() => {
    if (id) {
      setFinalText(finalTranscript)
      const groupText_ = finalTranscript.substring(preText.length)
      setGroupText(groupText_)
      const sendText = groupText_.substring(preText_.length)
      const contents_ = [...contents]
      contents_[context] = sendText
      setContents([...contents_])
      const postData: PostData = {
        group: group,
        contents: contents_,
      }
      console.log("textCount", textCount)
      if (textCount == 0) {
        pushByRefDB(db, `${id}/texts`, postData)
      } else {
        updateByQueryDB(db, `${id}/texts`, "group", group, "", postData)
      }
      setTextCount((old) => old + 1)
      getData()
    }
  }, [finalTranscript])

  const handleMicChange = () => {
    if (listening) {
      SpeechRecognition.stopListening()
    } else {
      SpeechRecognition.startListening({ continuous: true, language: "ja"})
    }
  }

  const handlePlusContext = () => {
    console.log(`group: ${group}, index: ${context+1}`)
    setContext((old) => old + 1)
    setPreText_(groupText)
  }

  const handlePlusGroup = () => {
    setGroup((old) => old + 1)
    setContext(0)
    console.log(`group: ${group}, index: 0`)
    setPreText(finalTranscript)
    setPreText_("")
    setTextCount(0)
    setContents([])
  }
  
  return (
    <Container sx={{position: "fixed", bottom: "20px", left: "50%", transform: "translate(-50%, 0%)", zIndex: 999}}>
      <Card elevation={10} sx={{display: "flex", flexDirection: "row", justifyContent: "center", flexGrow: 1, bgcolor: "#EEE"}}>
        <Box id="text-area" sx={{p: 1, height: "100px", width: "95%", overflowY: "auto"}}>
          <Typography color="text.main" fontWeight="bolder" my={2}>{finalText}<Typography component="span" color="#999" fontWeight="bolder">{interimText}</Typography></Typography>
        </Box>
        <Box sx={{my: "auto", mx: "10px", display: "flex", flexDirection: "row", justifyContent: "center"}}>
          <IconButton onClick={handleMicChange}>
            {listening ? (
              <Tooltip title="停止" placement="top">
                <MicOffIcon fontSize="large" color="primary"/>
              </Tooltip>
            ) : (
              <Tooltip title="開始" placement="top">
                <MicIcon fontSize="large" color="primary"/>
              </Tooltip>
            )}
          </IconButton>
          <IconButton onClick={handlePlusContext}>
            <Tooltip title="会話追加" placement="top">
              <AddIcon fontSize="large" color="primary"/>
            </Tooltip>
          </IconButton>
          <IconButton onClick={handlePlusGroup}>
            <Tooltip title="グループ追加" placement="top">
              <FlipCameraAndroidIcon fontSize="large" color="primary"/>
            </Tooltip>
          </IconButton>
        </Box>
      </Card>
    </Container>
  )
}
