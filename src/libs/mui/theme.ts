import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    palette: {
        mode: 'light',
            primary: {
                main: '#00BFA6',
            },
            secondary: {
                main: '#777777',
            },
            white: {
                main: '#ffffff',
                light: '#ffffff',
                dark: '#ffffff',
            },
            black: {
                main: '#000000',
                light: '#000000',
                dark: '#000000',
            }
    }
})

export default theme