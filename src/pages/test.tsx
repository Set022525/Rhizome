import { Box, Button, Container, Typography } from "@mui/material";
import { NextPage } from "next";
import { useEffect, useState } from "react";

const Test: NextPage = () => {
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    // データフェッチ
    setCounter(3)
  },[])
  
 return (
  <Container component="main">
    <Box>
      <Button variant="contained" onClick={() => setCounter(counter + 1)}>あああああ</Button>
      <Typography>{counter}</Typography>
    </Box>
  </Container>
 )
}

export default Test