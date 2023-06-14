import { AppBar, AppBarProps, styled } from "@mui/material";

export const StyledAppBar = styled(AppBar)<AppBarProps>({
  background: "primary.main",
  height: "100px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});
