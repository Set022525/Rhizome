import { Box, Card, Container, IconButton, Tooltip, Typography } from "@mui/material"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition"
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import { database } from "libs/firebase/firebase"
import { pushByRefDB, updateByQueryDB } from "libs/firebase/query"

type PostData = {
  group: number
  content: string
}

type Props = {
  interimText: string
  setInterimText: Dispatch<SetStateAction<string>>
  finalText: string
  setFinalText: Dispatch<SetStateAction<string>>

}

export default function Recognition( {interimText, setInterimText, finalText, setFinalText}: Props ) {
  const { interimTranscript, finalTranscript, listening, resetTranscript } = useSpeechRecognition()
  const [ group, setGroup ] = useState<number>(-1)
  const [ textCount, setTextCount ] = useState<number>(0)
  const db = database

  useEffect(() => {
    setInterimText(interimTranscript)
    const textArea = document.getElementById("text-area")
    if (textArea) {
      textArea.scrollTop = textArea.scrollHeight
    }
  }, [interimTranscript])

  useEffect(() => {
    setFinalText(finalTranscript)
    const postData: PostData = {
      group: group,
      content: finalText,
    }
    console.log("textCount", textCount)
    if (group != -1) {
      if (textCount == 0) {
        pushByRefDB(db, "texts", postData)
      } else {
        updateByQueryDB(db, "texts", "group", group, "", postData)
      }
      setTextCount((old) => old + 1)
    }
  }, [finalTranscript])

  const handleMicChange = () => {
    if (listening) {
      SpeechRecognition.stopListening()
    } else {
      setGroup((old) => old+1)
      console.log("group", group)
      setTextCount(0)
      SpeechRecognition.startListening({ continuous: true, language: "ja"})
    }
  }
  
  return (
    <Container sx={{position: "fixed", bottom: "20px", left: "50%", transform: "translate(-50%, 0%)", zIndex: 999}}>
      <Card elevation={10} sx={{display: "flex", flexDirection: "row", justifyContent: "center", flexGrow: 1, bgcolor: "#EEE"}}>
        <Box id="text-area" sx={{p: 1, height: "100px", width: "95%", overflowY: "auto"}}>
          <Typography color="text.main" fontWeight="bolder" my={2}>{finalText}<Typography component="span" color="#999" fontWeight="bolder">{interimText}</Typography></Typography>
        </Box>
        <Box sx={{my: "auto", mx: "10px"}}>
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
        </Box>
      </Card>
    </Container>
  )
}