import React, { FormEvent, useCallback, useEffect, useRef } from "react";
import {
  Grid,
  Typography,
  List,
  ListItem,
  ListItemButton,
  Divider,
  Collapse,
  Box,
  Fab,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  DialogActions,
  Button,
  Drawer,
  SwipeableDrawer,
} from "@mui/material";
import Navbar from "./Navbar";

import {
  ExpandMore,
  ExpandLess,
  People,
  Assignment,
  Close,
  Add,
  Star,
  StarOutline,
} from "@mui/icons-material";
import { useState } from "react";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import Boards from "./Boards";
import Members from "./Members";
import { useAuth } from "@/contexts/AuthContext";
import { axiosServer } from "@/services";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { StyledTextField } from "./Boards.styled";
import WithAuth from "@/HOCs/WithAuth";
import noProjectFound from "@/assets/images/noProjectFound.jpg";
import selectProject from "@/assets/images/selectProject.jpg";
import useMQ from "@/Hooks/useMQ";
import { useUpdates } from "@/contexts/UpdatesContext";

type projectType = {
  id: string;
  title: string;
  opened: boolean;
};

// eslint-disable-next-line react-refresh/only-export-components
const Dashboard = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { matchesLarge, matchesMedium, matchesSmall } = useMQ();
  const { updateStars, setUpdateStars } = useUpdates();

  const [projects, setProjects] = useState<projectType[]>([]);
  const [stars, setStars] = useState<number[]>([]);
  const [newProjectDialogShow, setNewProjectDialogShow] =
    useState<boolean>(false);
  const projectTitleInputRef = useRef<HTMLInputElement | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
        const project_title = projectTitleInputRef.current?.value;
        const response = await axiosServer.post(
          "/project/create",
          {
            project_title,
          },
          {
            headers: { Authorization: `Bearer ${auth}` },
          }
        );

        setNewProjectDialogShow(false);
        setProjects((projects) => [
          ...projects,
          {
            id: response.data[0].project_id,
            title: response.data[0].project_title,
            opened: false,
          } as projectType,
        ]);
        toast.success("Project Created Successfully", {
          autoClose: 2000,
          position: "top-center",
        });
      } catch (error) {
        console.log((error as AxiosError).response?.data);
      }
    },
    [auth]
  );
  const toggleCollapse = (id: string) => {
    setProjects((projects: projectType[]) => {
      const projectsCopy = [...projects];
      return projectsCopy.map((project: projectType) => {
        if (project.id === id) {
          project.opened = !project.opened;
        }
        return project;
      });
    });
  };
  const deleteProject = async (id: string) => {
    await axiosServer.delete(`/project/${id}`, {
      headers: { Authorization: `Bearer ${auth}` },
    });

    toast.success("Project Deleted Successfully", {
      autoClose: 1000,
      position: "top-center",
    });
    setProjects((projects) => projects.filter((project) => project.id !== id));

    const projectID = window.location.href.split("/")[4];
    if (id === projectID) {
      navigate("/dashboard");
    }
  };

  const setStar = async (projectId: number) => {
    try {
      await axiosServer.post(
        `/project/${projectId}/star`,
        {},
        {
          headers: { Authorization: `Bearer ${auth}` },
        }
      );
      setUpdateStars(true);
    } catch (error) {
      console.log((error as AxiosError).response?.data);
    }
  };
  const clearStar = async (projectId: number) => {
    try {
      await axiosServer.delete(`/project/${projectId}/star`, {
        headers: { Authorization: `Bearer ${auth}` },
      });
      setUpdateStars(true);
    } catch (error) {
      console.log((error as AxiosError).response?.data);
    }
  };

  useEffect(() => {
    loadData();
    if (updateStars) {
      loadStars();
    }
    async function loadData() {
      try {
        const response = await axiosServer.get("/project", {
          headers: { Authorization: `Bearer ${auth}` },
        });
        setProjects(
          response.data.map(
            (project: {
              project_id: number;
              project_title: string;
              project_creation_time: string;
            }): projectType => ({
              id: project.project_id.toString(),
              title: project.project_title,
              opened: false,
            })
          )
        );
      } catch (error) {
        console.log((error as AxiosError).response?.data);
      }
    }
    async function loadStars() {
      try {
        const response = await axiosServer.get("/project?filter=star", {
          headers: { Authorization: `Bearer ${auth}` },
        });
        setStars(response.data.map((project: any) => project.project_id));
        setUpdateStars(false);
      } catch (error) {
        console.log((error as AxiosError).response?.data);
      }
    }
  }, [auth, setUpdateStars, updateStars]);

  return (
    <>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar />
        {!matchesMedium && (
          <SwipeableDrawer
            open={openDrawer}
            onClose={() => setOpenDrawer(false)}
            onOpen={() => setOpenDrawer(true)}
          >
            <Box
              sx={{
                padding: "50px",
                minWidth: "300px",
              }}
            >
              <Typography
                sx={{
                  fontSize: "1.6rem",
                  fontWeight: "800",
                }}
              >
                Projects
              </Typography>

              <Divider />
              <List>
                {projects.map((project: projectType) => (
                  <React.Fragment key={project.id}>
                    <ListItem
                      sx={{
                        padding: "0",
                      }}
                    >
                      <ListItemButton
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "15px 5px",
                        }}
                        onClick={() => toggleCollapse(project.id)}
                      >
                        <Typography>{project.title}</Typography>
                        {project.opened ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                    </ListItem>
                    <ListItem
                      sx={{
                        padding: "0",
                      }}
                    >
                      <Collapse
                        in={project.opened}
                        timeout="auto"
                        unmountOnExit
                      >
                        <List>
                          <ListItemButton
                            onClick={() => {
                              setOpenDrawer(false);
                              navigate(`/dashboard/${project.id}/members`);
                            }}
                          >
                            <People />
                            <Typography
                              sx={{
                                margin: "0 10px",
                              }}
                            >
                              Members List
                            </Typography>
                          </ListItemButton>

                          <ListItemButton
                            onClick={() => {
                              setOpenDrawer(false);
                              navigate(`/dashboard/${project.id}/boards`);
                            }}
                          >
                            <Assignment />
                            <Typography
                              sx={{
                                margin: "0 10px",
                              }}
                            >
                              Boards
                            </Typography>
                          </ListItemButton>
                          <ListItemButton
                            sx={{
                              color: "primary.main",
                            }}
                            onClick={() => {
                              setOpenDrawer(false);

                              deleteProject(project.id);
                            }}
                          >
                            <Close />
                            <Typography
                              sx={{
                                margin: "0 10px",
                              }}
                            >
                              Delete Project
                            </Typography>
                          </ListItemButton>
                        </List>
                      </Collapse>
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </Box>
          </SwipeableDrawer>
        )}
        <Grid
          container
          sx={{
            width: matchesLarge ? "80%" : "97%",
            margin: "20px auto",
            flex: "1",
          }}
        >
          {matchesMedium && (
            <Grid item xs={2}>
              <Typography
                sx={{
                  fontSize: "1.6rem",
                  fontWeight: "800",
                }}
              >
                Projects
              </Typography>

              <Divider />
              <List>
                {projects.map((project: projectType) => (
                  <React.Fragment key={project.id}>
                    <ListItem
                      sx={{
                        padding: "0",
                      }}
                    >
                      <ListItemButton
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "15px 5px",
                        }}
                        onClick={() => toggleCollapse(project.id)}
                      >
                        <Typography>{project.title}</Typography>
                        {project.opened ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                    </ListItem>{" "}
                    <ListItem
                      sx={{
                        padding: "0",
                      }}
                    >
                      <Collapse
                        in={project.opened}
                        timeout="auto"
                        unmountOnExit
                      >
                        <List>
                          <ListItemButton
                            onClick={() => {
                              navigate(`/dashboard/${project.id}/members`);
                            }}
                          >
                            <People />
                            <Typography
                              sx={{
                                margin: "0 10px",
                              }}
                            >
                              Members List
                            </Typography>
                          </ListItemButton>
                          <ListItemButton
                            onClick={() => {
                              navigate(`/dashboard/${project.id}/boards`);
                            }}
                          >
                            <Assignment />
                            <Typography
                              sx={{
                                margin: "0 10px",
                              }}
                            >
                              Boards
                            </Typography>
                          </ListItemButton>
                          <ListItemButton
                            sx={{
                              color: "#000",
                            }}
                            onClick={() => {
                              if (stars.includes(parseInt(project.id))) {
                                clearStar(parseInt(project.id));
                              } else {
                                setStar(parseInt(project.id));
                              }
                            }}
                          >
                            {stars.includes(parseInt(project.id)) ? (
                              <>
                                <Star />
                                <Typography
                                  sx={{
                                    margin: "0 10px",
                                  }}
                                >
                                  Starred
                                </Typography>
                              </>
                            ) : (
                              <>
                                {" "}
                                <StarOutline />
                                <Typography
                                  sx={{
                                    margin: "0 10px",
                                  }}
                                >
                                  Star Project
                                </Typography>
                              </>
                            )}
                          </ListItemButton>
                          <ListItemButton
                            sx={{
                              color: "primary.main",
                            }}
                            onClick={() => {
                              deleteProject(project.id);
                            }}
                          >
                            <Close />

                            <Typography
                              sx={{
                                margin: "0 10px",
                              }}
                            >
                              Delete Project
                            </Typography>
                          </ListItemButton>
                        </List>
                      </Collapse>
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </Grid>
          )}
          <Grid item xs={matchesMedium ? 10 : 12}>
            <Routes>
              <Route path="/:id/members" element={<Members />} />
              <Route path="/:id/boards" element={<Boards />} />
              <Route
                path="/"
                element={
                  <>
                    {projects.length ? (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                          gap: "10px",
                          height: "100%",
                        }}
                      >
                        <img
                          src={selectProject}
                          style={{
                            maxWidth: matchesSmall ? "60vw" : "80vw",
                            maxHeight: matchesSmall ? "60vh" : "80vh",
                          }}
                        />
                        <Typography
                          variant="h4"
                          sx={{
                            textAlign: "center",
                          }}
                        >
                          Start Working on your projects Now!
                        </Typography>
                        {!matchesMedium && (
                          <Button
                            variant="contained"
                            sx={{
                              fontSize: "1.1rem",
                              fontWeight: "600",
                            }}
                            onClick={() => setOpenDrawer(true)}
                          >
                            Select Project
                          </Button>
                        )}
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                          gap: "10px",
                          height: "100%",
                        }}
                      >
                        <img
                          src={noProjectFound}
                          style={{
                            maxWidth: matchesSmall ? "60vw" : "80vw",
                            maxHeight: matchesSmall ? "60vh" : "80vh",
                          }}
                        />
                        <Typography variant="h5" sx={{ textAlign: "center" }}>
                          It seams that you don't have any projects yet
                        </Typography>
                        <Button
                          variant="contained"
                          onClick={() => setNewProjectDialogShow(true)}
                        >
                          Create your first Project
                        </Button>
                      </Box>
                    )}
                  </>
                }
              />
            </Routes>
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          position: "fixed",
          right: "5%",
          bottom: "5%",
        }}
      >
        <Fab
          variant="extended"
          sx={{
            backgroundColor: "primary.main",
            color: "white.main",
            transition: "all 200ms ease-in-out",
            "&:hover": {
              backgroundColor: "primary.main",
              color: "white.main",
              transform: "scale(1.05)",
            },
          }}
          onClick={() => setNewProjectDialogShow(true)}
        >
          <Add sx={{ fontSize: "2rem", fontWeight: "inherit" }} />
          <Typography
            sx={{
              margin: "0 10px",
              textTransform: "none",
              fontSize: "1.2rem",
            }}
          >
            New Project
          </Typography>
        </Fab>
      </Box>
      <Dialog
        open={newProjectDialogShow}
        onClose={() => {
          setNewProjectDialogShow(false);
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          New Project
          <IconButton onClick={() => setNewProjectDialogShow(false)}>
            <Close />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent
            sx={{
              padding: "0 20px",
            }}
          >
            <StyledTextField
              name="project-name"
              label="Project Name"
              inputRef={projectTitleInputRef}
              required={true}
            />
            {/* <StyledTextField name="member-list" label="Members' emails" /> */}
          </DialogContent>
          <DialogActions>
            <Button
              type="submit"
              sx={{
                fontSize: "0.9rem",
                fontWeight: "600",
                margin: "5px",
                backgroundColor: "primary.main",
                color: "white.main",
                "&:hover": {
                  backgroundColor: "primary.main",
                  color: "white.main",
                },
              }}
            >
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default WithAuth(Dashboard);
