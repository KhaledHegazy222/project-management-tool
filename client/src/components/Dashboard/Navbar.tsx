import React from "react";
import {
  AppBar,
  Box,
  Button,
  InputBase,
  Toolbar,
  Typography,
} from "@mui/material";
import { StyledNavButton } from "./Dashboard.styled";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import logo from "@/assets/images/logo100.png";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";

const Navbar = () => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              height: "100%",
            }}
          >
            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                textDecoration: "none",
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
                  fontWeight: "900",
                  color: (theme) => `${theme.palette.white.main}`,
                }}
              >
                Ngatur
              </Typography>
            </Link>
          </Box>
          <Box
            sx={{
              margin: "0 50px",
              flexGrow: 1,
              display: "flex",
              justifyContent: "flex-start",
              flexDirection: "row",
            }}
          >
            <StyledNavButton>
              <Typography sx={{ fontSize: "inherit", fontWeight: "inherit" }}>
                Workspaces
              </Typography>
              <ExpandMoreIcon
                sx={{ fontSize: "inherit", fontWeight: "inherit" }}
              />
            </StyledNavButton>
            <StyledNavButton>
              <Typography sx={{ fontSize: "inherit", fontWeight: "inherit" }}>
                Recent
              </Typography>
              <ExpandMoreIcon
                sx={{ fontSize: "inherit", fontWeight: "inherit" }}
              />
            </StyledNavButton>
            <StyledNavButton>
              <Typography sx={{ fontSize: "inherit", fontWeight: "inherit" }}>
                Starred
              </Typography>
              <ExpandMoreIcon
                sx={{ fontSize: "inherit", fontWeight: "inherit" }}
              />
            </StyledNavButton>
            <Button
              sx={{
                backgroundColor: "white.main",
                margin: "10px",
                fontSize: "1rem",
                fontWeight: "600",
                "&:hover": {
                  backgroundColor: "white.main",
                  color: "primary.main",
                },
              }}
            >
              Create
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              backgroundColor: "rgba(230,230,230,0.5)",
              padding: "5px",
              borderRadius: "10px",
              color: "white.main",
              "&:hover": {
                backgroundColor: "rgba(230,230,230,0.6)",
              },
            }}
          >
            <SearchIcon />
            <InputBase
              sx={{
                color: "inherit",
              }}
              placeholder="Search…"
            />
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
