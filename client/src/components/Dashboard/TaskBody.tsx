import React from "react";
import { Avatar, Box, Divider, IconButton, Typography } from "@mui/material";
import { AttachFile, Comment, MoreHoriz } from "@mui/icons-material";
import avatarImage from "@/assets/images/avatar.avif";

type labelType = {
  name: string;
  color: string;
};

export type taskType = {
  name: string;
  description?: string;
  state: "Todo" | "Pending" | "On Review" | "Completed";
  labels: labelType[];
  assignee: string;
  reviewer: string;
  deadLine: string;
  comments: string[];
};
const TaskBody = ({
  name,
  description,
  state,
  labels,
  assignee,
  reviewer,
  deadLine,
  comments,
}: taskType) => {
  return (
    <Box sx={{ padding: "10px 5px", cursor: "pointer" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: "1.1rem",
            fontWeight: "700",
          }}
        >
          {name}
        </Typography>
        <IconButton
          sx={{
            padding: "5px",
          }}
        >
          <MoreHoriz />
        </IconButton>
      </Box>
      <Typography
        variant="subtitle1"
        sx={{
          fontSize: "0.9rem",
          color: "rgb(130,130,130)",
        }}
      >
        {description}
      </Typography>
      <Divider
        textAlign="center"
        variant="middle"
        sx={{
          margin: "10px 0",
        }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Avatar alt="Avatar" src={avatarImage} />

        <Box
          sx={{
            fontSize: "1.2rem",
          }}
        >
          {!comments.length && (
            <IconButton
              sx={{
                fontSize: "inherit",
                aspectRatio: "1 / 1",
                padding: "3px",
              }}
            >
              <Comment
                sx={{
                  fontSize: "inherit",
                  margin: "0 5px",
                }}
              />
              {comments.length}
            </IconButton>
          )}
          {!comments.length && (
            <IconButton
              sx={{
                fontSize: "inherit",
                aspectRatio: "1 / 1",
                padding: "3px",
              }}
            >
              <AttachFile
                sx={{
                  fontSize: "inherit",
                  margin: "0 5px",
                }}
              />
              {comments.length}
            </IconButton>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default TaskBody;
