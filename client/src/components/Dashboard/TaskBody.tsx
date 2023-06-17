import {
  Avatar,
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { AttachFile, Comment, MoreHoriz } from "@mui/icons-material";
import avatarImage from "@/assets/images/avatar.avif";
import { useState } from "react";

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
  const [taskDialogShow, setTaskDialogShow] = useState<boolean>(false);
  return (
    <>
      <Box
        sx={{ padding: "10px 5px", cursor: "pointer" }}
        onClick={() => setTaskDialogShow(true)}
      >
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
      <Dialog
        open={taskDialogShow}
        onClose={() => {
          setTaskDialogShow(false);
        }}
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "700",
                display: "inline-block",
              }}
            >
              {name}
              <Chip label={state} variant="filled" sx={{ margin: "0 5px" }} />
            </Typography>

            <IconButton>
              <MoreHoriz sx={{ fontSize: "2rem" }} />
            </IconButton>
          </Box>

          <Box
            sx={{
              fontSize: "0.9rem",
              color: "rgb(100,100,100)",
            }}
          >
            {description}
          </Box>
        </DialogTitle>
        <Divider variant="middle" />
        <DialogContent>
          <Typography
            variant="h6"
            sx={{ marginBottom: "20px", fontWeight: "700" }}
          >
            Comments
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Avatar src="#" alt="User" />
            <TextField
              variant="filled"
              placeholder="Write a comment..."
              sx={{ flex: "1", margin: "0 10px" }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskBody;
