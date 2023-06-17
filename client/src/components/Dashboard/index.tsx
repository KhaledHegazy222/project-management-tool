import React, { FC, FormEvent, useCallback, useEffect, useRef } from "react";
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
} from "@mui/material";
import Navbar from "./Navbar";

import {
  ExpandMore,
  ExpandLess,
  People,
  Assignment,
  Close,
  Add,
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

type projectType = {
  id: string;
  title: string;
  opened: boolean;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [projects, setProjects] = useState<projectType[]>([]);
  const [newProjectDialogShow, setNewProjectDialogShow] =
    useState<boolean>(false);
  const projectTitleInputRef = useRef<HTMLInputElement | null>(null);
  console.log(projects);
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
        const project_title = projectTitleInputRef.current?.value;
        await axiosServer.post(
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
            id: project_title,
            title: project_title,
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

  useEffect(() => {
    loadData();
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
  }, [auth]);

  return (
    <>
      <Navbar />
      <Grid
        container
        sx={{
          width: "80%",
          margin: "20px auto",
        }}
      >
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
                  <Collapse in={project.opened} timeout="auto" unmountOnExit>
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
        <Grid item xs={10}>
          <Routes>
            <Route path="/:id/members" element={<Members />} />
            <Route path="/:id/boards" element={<Boards />} />
          </Routes>
        </Grid>
      </Grid>
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

export default WithAuth(Dashboard) ;
