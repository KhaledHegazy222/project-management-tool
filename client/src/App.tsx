import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Navbar from "./components/Navbar/Navbar";
import "@fontsource/inter";
import Hero from "./components/Home/Hero/Hero";

const theme = createTheme({
  palette: {
    primary: {
      main: "#e51b26",
    },
    secondary: {
      main: "#fff",
    },
  },
  typography: {
    fontFamily: `"inter", "Roboto", "Helvetica", "Arial", sans-serif`,
  },
});

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Navbar />
        <Hero />
        <CssBaseline />
      </ThemeProvider>
    </>
  );
}

export default App;
