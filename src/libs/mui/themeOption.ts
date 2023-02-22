import * as PaletteColorOptions from '@mui/material/styles/createPalette'

// PaletteOptions を拡張して、カラーキーワードを追加
declare module '@mui/material/styles/createPalette' {
    interface PaletteOptions {
      white?: PaletteColorOptions;
      black?: PaletteColorOptions;
    }
}

// Button の color prop に追加
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    white: true;
    black: true;
  }
}