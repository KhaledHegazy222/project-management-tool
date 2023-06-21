/* eslint-disable */

import React, { useEffect, useState } from "react";
import {
  AppBar,
  Badge,
  Box,
  Button,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { StyledNavButton } from "./Dashboard.styled";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import logo from "@/assets/images/logo100.png";
import { Link, useNavigate } from "react-router-dom";

import {
  Close,
  Done,
  Notifications,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import { AxiosError } from "axios";
import { axiosServer } from "@/services";
import { toast } from "react-toastify";
import { useUpdates } from "@/contexts/UpdatesContext";
import useMQ from "@/Hooks/useMQ";

type requestType = {
  project_id: number;
  project_title: string;
  request_first_seen: boolean;
};

const Navbar = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const [requests, setRequests] = useState<requestType[]>([]);
  const { updateRequests, setUpdateRequests } = useUpdates();
  const [stars, setStars] = useState<any[]>([]);
  const { updateStars, setUpdateStars } = useUpdates();
  const [starsAnchorMenu, setStarsAnchorMenu] = useState<null | HTMLElement>(
    null
  );
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [recentAnchorMenu, setRecentAnchorMenu] = useState<null | HTMLElement>(
    null
  );
  const { matchesMedium } = useMQ();

  const [openMenuDrawer, setOpenMenuDrawer] = useState<boolean>(false);
  const starsMenuOpen = Boolean(starsAnchorMenu);
  const handleStarMenuClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setStarsAnchorMenu(e.currentTarget);
  };

  const handleStarsMenuClose = () => {
    setStarsAnchorMenu(null);
  };

  const recentMenuOpen = Boolean(recentAnchorMenu);
  const handleRecentMenuClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setRecentAnchorMenu(e.currentTarget);
  };

  const handleRecentMenuClose = () => {
    setRecentAnchorMenu(null);
  };
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
    try {
      await axiosServer.patch(
        `/request/seen`,
        {},
        { headers: { Authorization: `Bearer ${auth}` } }
      );
      setUpdateRequests(true);
    } catch (error) {
      console.log(error as AxiosError);
    }
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
    if (updateRequests) {
      loadRequests();
      setUpdateRequests(false);
    }
    loadRecentProjects();
    if (updateStars) {
      loadStars();
    }
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
    async function loadStars() {
      try {
        const response = await axiosServer.get("/project?filter=star", {
          headers: { Authorization: `Bearer ${auth}` },
        });
        setStars(response.data);
        setUpdateStars(false);
      } catch (error) {
        console.log((error as AxiosError).response?.data);
      }
    }
    async function loadRecentProjects() {
      try {
        const response = await axiosServer.get("/project?filter=recent", {
          headers: { Authorization: `Bearer ${auth}` },
        });

        setRecentProjects(response.data);
      } catch (error) {
        console.log((error as AxiosError).response?.data);
      }
    }
  }, [auth, updateStars, setUpdateStars, updateRequests, setUpdateRequests]);
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
          {matchesMedium && (
            <>
              <Box
                sx={{
                  margin: "0 50px",
                  flexGrow: 1,
                  display: "flex",
                  justifyContent: "flex-start",
                  flexDirection: "row",
                }}
              >
                <StyledNavButton onClick={handleRecentMenuClick}>
                  <Typography
                    sx={{ fontSize: "inherit", fontWeight: "inherit" }}
                  >
                    Recent
                  </Typography>
                  <ExpandMoreIcon
                    sx={{ fontSize: "inherit", fontWeight: "inherit" }}
                  />
                </StyledNavButton>
                <Menu
                  open={recentMenuOpen}
                  anchorEl={recentAnchorMenu}
                  onClose={handleRecentMenuClose}
                >
                  {recentProjects.length ? (
                    recentProjects.map((project) => (
                      <MenuItem
                        key={project.project_id}
                        onClick={() =>
                          navigate(`/dashboard/${project.project_id}/boards`)
                        }
                      >
                        {project.project_title}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>
                      Currently, you don't have any recent Projects!
                    </MenuItem>
                  )}
                </Menu>
                <StyledNavButton onClick={handleStarMenuClick}>
                  <Typography
                    sx={{ fontSize: "inherit", fontWeight: "inherit" }}
                  >
                    Starred
                  </Typography>
                  <ExpandMoreIcon
                    sx={{ fontSize: "inherit", fontWeight: "inherit" }}
                  />
                </StyledNavButton>
                <Menu
                  open={starsMenuOpen}
                  anchorEl={starsAnchorMenu}
                  onClose={() => {
                    handleStarsMenuClose();
                  }}
                >
                  {stars.length ? (
                    stars.map((project) => (
                      <MenuItem
                        key={project.project_id}
                        onClick={() =>
                          navigate(`/dashboard/${project.project_id}/boards`)
                        }
                      >
                        {project.project_title}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>
                      Currently, you don't have any starred Projects!
                    </MenuItem>
                  )}
                </Menu>
              </Box>
              <Box>
                <IconButton
                  onClick={handleClick}
                  sx={{
                    margin: "0 20px",
                  }}
                >
                  <Badge
                    badgeContent={requests.reduce(
                      (total, current) =>
                        total + Number(current.request_first_seen),
                      0
                    )}
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
            </>
          )}

          {!matchesMedium && (
            <>
              <IconButton onClick={() => setOpenMenuDrawer(true)}>
                <MenuIcon sx={{ color: "white.main" }} />
              </IconButton>

              <Drawer
                open={openMenuDrawer}
                onClose={() => setOpenMenuDrawer(false)}
                anchor="right"
              >
                <Box
                  sx={{
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "20px",
                  }}
                >
                  <Button onClick={handleRecentMenuClick}>
                    <Typography
                      sx={{ fontSize: "inherit", fontWeight: "inherit" }}
                    >
                      Recent
                    </Typography>
                    <ExpandMoreIcon
                      sx={{ fontSize: "inherit", fontWeight: "inherit" }}
                    />
                  </Button>
                  <Menu
                    open={recentMenuOpen}
                    anchorEl={recentAnchorMenu}
                    onClose={handleRecentMenuClose}
                  >
                    {recentProjects.length ? (
                      recentProjects.map((project) => (
                        <MenuItem
                          key={project.project_id}
                          onClick={() =>
                            navigate(`/dashboard/${project.project_id}/boards`)
                          }
                        >
                          {project.project_title}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>
                        Currently, you don't have any recent Projects!
                      </MenuItem>
                    )}
                  </Menu>
                  <Button onClick={handleStarMenuClick}>
                    <Typography
                      sx={{ fontSize: "inherit", fontWeight: "inherit" }}
                    >
                      Starred
                    </Typography>
                    <ExpandMoreIcon
                      sx={{ fontSize: "inherit", fontWeight: "inherit" }}
                    />
                  </Button>
                  <Menu
                    open={starsMenuOpen}
                    anchorEl={starsAnchorMenu}
                    onClose={() => {
                      handleStarsMenuClose();
                    }}
                  >
                    {stars.length ? (
                      stars.map((project) => (
                        <MenuItem
                          key={project.project_id}
                          onClick={() =>
                            navigate(`/dashboard/${project.project_id}/boards`)
                          }
                        >
                          {project.project_title}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>
                        Currently, you don't have any starred Projects!
                      </MenuItem>
                    )}
                  </Menu>

                  <Box>
                    <IconButton
                      onClick={handleClick}
                      sx={{
                        margin: "0 20px",
                        color: "gray",
                      }}
                    >
                      <Badge
                        badgeContent={requests.reduce(
                          (total, current) =>
                            total + Number(current.request_first_seen),
                          0
                        )}
                        sx={{
                          "& span": {
                            color: "white.main",
                          },
                        }}
                      >
                        <Notifications
                          sx={{
                            color: "black",
                          }}
                        />
                      </Badge>
                      <Typography>Notifications</Typography>
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
                                onClick={() =>
                                  acceptRequest(request.project_id)
                                }
                              >
                                <Done sx={{ color: "green" }} />
                              </IconButton>
                              <IconButton
                                onClick={() =>
                                  cancelRequest(request.project_id)
                                }
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
                  </Box>
                  <Button variant="contained"> logout</Button>
                </Box>
              </Drawer>
            </>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
