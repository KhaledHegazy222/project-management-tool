import { Button, ButtonProps, TextField, styled } from "@mui/material";
import { Link } from "react-router-dom";

export const StyledButton = styled(Button)<ButtonProps>(({ theme }) => ({
  width: "100%",
  margin: "10px 0",
  // background: `linear-gradient(90deg,${theme.palette.primary.main},${theme.palette.secondary.main})`,
  background: `${theme.palette.primary.main}`,
  color: "white",
  fontSize: "1.1rem",
  "&:hover": {
    background: `${theme.palette.primary.main}`,
    color: "white",
  },
}));

export const StyledTextField = styled(TextField)(() => ({
  width: "100%",
  margin: "10px 0",
}));

export const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  color: `${theme.palette.primary.main}`,
  fontWeight: "600",
  "&:hover": {
    color: `${theme.palette.primary.dark}`,
  },
}));
