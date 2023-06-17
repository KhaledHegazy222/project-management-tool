import React from "react";
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
} from "@mui/icons-material";
import { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Boards from "./Boards";
import Members from "./Members";

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
                      <ListItemButton>
                        <Settings />
                        <Typography
                          sx={{
                            margin: "0 10px",
                          }}
                        >
                          Project Settings
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
