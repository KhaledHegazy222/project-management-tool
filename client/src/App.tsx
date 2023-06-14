import "@fontsource/inter";
import { routes } from "./pages/routes";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "@/theme";

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {routes}
      </ThemeProvider>
    </>
  );
}

export default App;
