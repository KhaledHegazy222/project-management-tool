import { Button, ButtonProps, TextField, styled } from "@mui/material";

export const StyledButton = styled(Button)<ButtonProps>(({ theme }) => ({
  width: "100%",
  margin: "30px 0",
  background: `linear-gradient(90deg,${theme.palette.primary.main},${theme.palette.secondary.main})`,
  color: "white",
  fontSize: "1.1rem",
}));

export const StyledTextField = styled(TextField)(() => ({
  margin: "10px 0",
  "& .MuiInputBase-input.MuiOutlinedInput-input": {
    width: "400px",
  },
}));
