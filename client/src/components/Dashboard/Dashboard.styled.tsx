import { Button, styled } from "@mui/material";

export const StyledNavButton = styled(Button)(({ theme }) => ({
  color: `${theme.palette.white.main}`,
  display: "flex",
  alignItems: "center",
  flexDirection: "row",
  margin: "10px",
  fontSize: "1.1rem",
  fontWeight: "600",
  padding: "10px",
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
}));
