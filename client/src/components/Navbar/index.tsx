import { Box, Button, Toolbar, Typography } from "@mui/material";
import { StyledAppBar } from "./AppBar.styled";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import logo from "@/assets/images/logo100.png";
import { useNavigate } from "react-router-dom";
import useMQ from "@/Hooks/useMQ";

const navElements: string[] = [
  "Features",
  "Solutions",
  "Plans",
  "Pricing",
  "Resources",
];
const Navbar = () => {
  const navigate = useNavigate();
  const { matchesLarge } = useMQ();

  return (
    <StyledAppBar position="static">
      <Toolbar
        sx={{
          width: matchesLarge ? "90%" : "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "10px",
            height: "100%",
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              filter: "invert(100%)",
              height: "40px",
            }}
          />
          <Typography
            sx={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: (theme) => `${theme.palette.white.main}`,
            }}
          >
            Ngatur
          </Typography>
        </Box>

        {matchesLarge && (
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            {navElements.map((element) => (
              <Button
                key={element}
                sx={{
                  color: "white.main",
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  margin: "10px",
                }}
              >
                <Typography>{element}</Typography>
                <ExpandMoreIcon sx={{ color: "white.main", margin: "5px" }} />
              </Button>
            ))}
          </Box>
        )}
        <Button
          onClick={() => navigate("/dashboard")}
          sx={{
            backgroundColor: "white.main",
            color: "primary.main",
            padding: "15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "all 400ms ease-in-out",
            border: "1px solid",

            borderRadius: "5px",
            "&:hover": {
              backgroundColor: "white.main",
              borderColor: "white.main",
              color: "primary.main",
            },
          }}
        >
          <Typography
            sx={{
              fontSize: "1rem",
              fontWeight: "600",
              whiteSpace: "nowrap",
              textTransform: "none",
            }}
          >
            Go to your Dashboard
          </Typography>
        </Button>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;
