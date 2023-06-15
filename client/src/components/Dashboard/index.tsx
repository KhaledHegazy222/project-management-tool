import React from "react";
import {
  Box,
  Grid,
  Typography,
  List,
  ListItem,
  IconButton,
  ListItemButton,
  Divider,
  Collapse,
} from "@mui/material";
import Navbar from "./Navbar";

import {
  AddBox,
  ExpandMore,
  ExpandLess,
  People,
  Assignment,
} from "@mui/icons-material";
import { useState } from "react";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import Tasks from "./Tasks";
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
          width: "70%",
          margin: "20px auto",
        }}
      >
        <Grid item xs={2}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0",
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
            <IconButton>
              <AddBox
                sx={{
                  color: (theme) => `${theme.palette.primary.main}`,
                  fontSize: "1.7rem",
                }}
              />
            </IconButton>
          </Box>
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
                          navigate(`/dashboard/${project.id}/tasks`);
                        }}
                      >
                        <Assignment />
                        <Typography
                          sx={{
                            margin: "0 10px",
                          }}
                        >
                          Tasks
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
            <Route path="/:id/tasks" element={<Tasks />} />
          </Routes>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
