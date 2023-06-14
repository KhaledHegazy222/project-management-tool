import { PaletteColor, PaletteColorOptions, createTheme } from "@mui/material";

declare module "@mui/material/styles" {
  interface Palette {
    white: PaletteColor;
    black: PaletteColor;
  }
  interface PaletteOptions {
    white?: PaletteColorOptions;
    black?: PaletteColorOptions;
  }
}
const theme = createTheme({
  palette: {
    primary: {
      main: "#e51b26",
    },
    secondary: {
      main: "#ffa500",
    },
    white: {
      main: "#fff",
    },
    black: {
      main: "#000",
    },
  },
  typography: {
    fontFamily: `"inter", "Roboto", "Helvetica", "Arial", sans-serif`,
  },
});

export default theme;
