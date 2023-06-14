import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import "@fontsource/inter";
import { routes } from "./pages/routes";

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
        {routes}
        <CssBaseline />
      </ThemeProvider>
    </>
  );
}

export default App;
