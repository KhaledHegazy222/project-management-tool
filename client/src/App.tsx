import "@fontsource/inter";
import { routes } from "./pages/routes";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "@/theme";
import "react-toastify/dist/ReactToastify.css";
import "react-multi-email/dist/style.css";
import { ToastContainer } from "react-toastify";
import { useAuth } from "./contexts/AuthContext";

function App() {
  const { loading } = useAuth();
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastContainer />
        {loading ? "Loading" : routes}
      </ThemeProvider>
    </>
  );
}

export default App;
