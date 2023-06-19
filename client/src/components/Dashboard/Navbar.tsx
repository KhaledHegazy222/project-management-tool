import React, { useEffect, useState } from "react";
import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { StyledNavButton } from "./Dashboard.styled";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import logo from "@/assets/images/logo100.png";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { Close, Done, Notifications } from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import { AxiosError } from "axios";
import { axiosServer } from "@/services";
import { toast } from "react-toastify";

type requestType = {
  project_id: number;
  project_title: string;
};

const Navbar = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const [requests, setRequests] = useState<requestType[]>([]);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const acceptRequest = async (project_id: number) => {
    try {
      await axiosServer.post(
        "/request/accept",
        {
          project_id,
        },
        { headers: { Authorization: `Bearer ${auth}` } }
      );
      toast.success("Invitation Accepted Successfully", {
        autoClose: 1000,
        position: "top-center",
      });
      setRequests((requests) =>
        requests.filter((request) => request.project_id !== project_id)
      );
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.log((error as AxiosError).response?.data);
    }
  };

  const cancelRequest = async (project_id: number) => {
    try {
      await axiosServer.post(
        "/request/cancel",
        {
          project_id,
        },
        { headers: { Authorization: `Bearer ${auth}` } }
      );
      toast.success("Invitation Canceled Successfully", {
        autoClose: 1000,
        position: "top-center",
      });

      setRequests((requests) =>
        requests.filter((request) => request.project_id !== project_id)
      );
    } catch (error) {
      console.log((error as AxiosError).response?.data);
    }
  };

  useEffect(() => {
    loadRequests();
    async function loadRequests() {
      try {
        const response = await axiosServer.get("/request", {
          headers: { Authorization: `Bearer ${auth}` },
        });
        setRequests(response.data);
      } catch (error) {
        console.log((error as AxiosError).response?.data);
      }
    }
  }, [auth]);
  return (
    <>
      <AppBar position="static">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
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
                PMT
              </Typography>
            </Link>
          </Box>
          {/* <Box
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
          </Box> */}
          <Box>
            <IconButton
              onClick={handleClick}
              sx={{
                margin: "0 20px",
              }}
            >
              <Badge
                badgeContent={requests.length}
                sx={{
                  "& span": {
                    backgroundColor: "white.main",
                    color: "primary.main",
                  },
                }}
              >
                <Notifications
                  sx={{
                    color: "white.main",
                  }}
                />
              </Badge>
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              {requests.length ? (
                requests.map((request: requestType) => (
                  <MenuItem
                    key={request.project_id}
                    disableRipple
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography>{`You're invited to join ${request.project_title}`}</Typography>
                    <Box
                      sx={{
                        marginLeft: "20px",
                      }}
                    >
                      <IconButton
                        onClick={() => acceptRequest(request.project_id)}
                      >
                        <Done sx={{ color: "green" }} />
                      </IconButton>
                      <IconButton
                        onClick={() => cancelRequest(request.project_id)}
                      >
                        <Close sx={{ color: "red" }} />
                      </IconButton>
                    </Box>
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>
                  Currently, you don't have any invitations!
                </MenuItem>
              )}
            </Menu>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "white.main",
                color: "primary.main",
                fontWeight: "700",
                "&:hover": {
                  backgroundColor: "white.main",
                  color: "primary.main",
                },
              }}
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
