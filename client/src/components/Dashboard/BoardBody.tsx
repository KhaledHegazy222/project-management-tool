import React from "react";
import TaskBody, { taskType } from "./TaskBody";
import { Box, List, ListItem, ListItemButton, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import CustomBadge from "./CustomBadge";

export type boardType = {
  name: string;
  color: string;
  tasks: taskType[];
};

const BoardBody = ({ name, color, tasks }: boardType) => {
  return (
    <Box
      sx={{
        width: "clamp(250px,50%,300px)",
        flexShrink: "0",
        margin: "10px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "0 20px",
        }}
      >
        <CustomBadge color={color} />
        <Typography variant="h6" sx={{
          fontWeight:"600"
        }}>{name}</Typography>
      </Box>
      <List>
        <ListItemButton
          sx={{
            background: "rgba(0,0,0,0.1)",
            color: "black.main",
            borderRadius: "10px",
            "&:hover": {
              backgroundColor: "primary.main",
              color: "white.main",
            },
          }}
        >
          <Add sx={{ margin: "auto" }} />
        </ListItemButton>
        {tasks.map((task: taskType) => (
          <ListItem
            sx={{
              background: "rgba(0,0,0,0.1)",
              margin: "10px 0",
              borderRadius: "10px",
              "&:hover": {
                background: "rgba(0,0,0,0.2)",
              },
            }}
          >
            <TaskBody {...task} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default BoardBody;