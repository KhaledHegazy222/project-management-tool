import React, { useEffect } from "react";
import {
  Grid,
  Typography,
  List,
  ListItem,
  ListItemButton,
  Divider,
  Collapse,
} from "@mui/material";
import Navbar from "./Navbar";

import {
  ExpandMore,
  ExpandLess,
  People,
  Assignment,
  Settings,
  Close,
} from "@mui/icons-material";
import { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Boards from "./Boards";
import Members from "./Members";
import { useAuth } from "@/contexts/AuthContext";
import { axiosServer } from "@/services";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

type projectType = {
  id: string;
  title: string;
  opened: boolean;
};
const projectsInitialValue: projectType[] = [
  {
    id: "1",
    title: "Project 1",
    opened: false,
  },
  {
    id: "2",
    title: "Project 2",
    opened: false,
  },
  {
    id: "3",
    title: "Project 3",
    opened: false,
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [projects, setProjects] = useState<projectType[]>(projectsInitialValue);

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
    await axiosServer.post(
      `/project/${id}/delete`,
      {},
      {
        headers: { Authorization: `Bearer ${auth}` },
      }
    );

    toast.success("Project Deleted Successfully", {
      autoClose: 1000,
      position: "top-center",
    });
    setProjects((projects) => projects.filter((project) => project.id !== id));
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
            (project: { project_id: number }): projectType => ({
              id: project.project_id.toString(),
              title: `project ${project.project_id}`,
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
    </>
  );
};

export default Dashboard;
