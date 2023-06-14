import { Button, ButtonProps, styled } from "@mui/material";

export const StyledButton = styled(Button)<ButtonProps>(() => ({
  width: "250px",
  padding: "20px 10px",
  fontSize: "1.1rem",
  borderRadius: "7px",
  fontWeight: "700",
  border: "1px solid",
}));
