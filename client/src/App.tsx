import "@fontsource/inter";
import { routes } from "./pages/routes";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "@/theme";
import "react-toastify/dist/ReactToastify.css";
import "react-multi-email/dist/style.css";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastContainer />
        {routes}
      </ThemeProvider>
    </>
  );
}

export default App;
