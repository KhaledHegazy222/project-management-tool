import {
  Avatar,
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { Comment, MoreHoriz } from "@mui/icons-material";
import avatarImage from "@/assets/images/avatar.avif";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { axiosServer } from "@/services";
import { AxiosError } from "axios";

import useProjectMembers from "@/Hooks/useProjectMembers";
import { useUpdates } from "@/contexts/UpdatesContext";

export type taskType = {
  id: number;
  projectId: number;
  name: string;
  description?: string;
  state: "New Request" | "In Progress" | "On Review" | "Complete";
  assignee: number;
  reviewer: number;
  deadLine: string;
};

type commentType = {
  first_name: string;
  last_name: string;
  creation_time: string;
  comment_content: string;
};

const TaskBody = ({
  id,
  projectId,
  name,
  description,
  state,
  assignee,
  reviewer,
}: taskType) => {
  const { auth, user } = useAuth();
  const [, members] = useProjectMembers(projectId);
  const { updatedTask, setUpdatedTask, announceComment } = useUpdates();
  const commentInputRef = useRef<HTMLInputElement | null>(null);
  const { setUpdatedProject } = useUpdates();
  const [taskDialogShow, setTaskDialogShow] = useState<boolean>(false);
  const [comments, setComments] = useState<commentType[]>([]);
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        await axiosServer.post(
          `/task/${id}/comment/create`,
          {
            comment_content: commentInputRef.current?.value,
          },
          { headers: { Authorization: `Bearer ${auth}` } }
        );
        setComments(
          (comments: commentType[]): commentType[] =>
            [
              ...comments,
              {
                first_name: user?.first_name,
                last_name: user?.last_name,
                creation_time: Date.now().toString(),
                comment_content: commentInputRef.current?.value,
              },
            ] as commentType[]
        );

        (commentInputRef.current as HTMLInputElement).value = "";
        announceComment(id);
      } catch (error) {
        console.log((error as AxiosError).response?.data);
      }
    },
    [auth, id, announceComment]
  );
  const loadComments = useCallback(async () => {
    try {
      const response = await axiosServer.get(`/task/${id}/comment`, {
        headers: { Authorization: `Bearer ${auth}` },
      });
      setComments(response.data);
    } catch (error) {
      console.log((error as AxiosError).response?.data);
    }
  }, [id, auth]);

  const [stateMenuAnchor, setStateMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const openStateMenu = Boolean(stateMenuAnchor);
  const handleStateClick = (e: React.MouseEvent<HTMLElement>) => {
    setStateMenuAnchor(e.currentTarget);
  };
  const handleStateClose = () => {
    setStateMenuAnchor(null);
  };
  const updateState = async (newState: string) => {
    axiosServer.patch(
      `/task/${id}`,
      {
        task_state: newState,
      },
      {
        headers: { Authorization: `Bearer ${auth}` },
      }
    );
    setUpdatedProject(projectId);
  };

  useEffect(() => {
    if (updatedTask === id) {
      loadComments();
      setUpdatedTask(null);
    }
  }, [id, updatedTask, setUpdatedTask, loadComments]);
  useEffect(() => {
    loadComments();
  }, [loadComments]);
  return (
    <>
      <Box
        sx={{ padding: "10px 5px", cursor: "pointer", width: "100%" }}
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

            {/* {!!comments.length && (
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
            )} */}
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
              <Chip
                label={state}
                variant="filled"
                sx={{ margin: "0 5px" }}
                onClick={handleStateClick}
              />
              <Menu
                open={openStateMenu}
                anchorEl={stateMenuAnchor}
                onClose={handleStateClose}
              >
                <MenuItem onClick={() => updateState("New Request")}>
                  New Request
                </MenuItem>
                <MenuItem onClick={() => updateState("In Progress")}>
                  In Progress
                </MenuItem>
                <MenuItem onClick={() => updateState("On Review")}>
                  On Review
                </MenuItem>
                <MenuItem onClick={() => updateState("Complete")}>
                  Complete
                </MenuItem>
              </Menu>
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
          <Box sx={{ display: "flex", gap: "20px", margin: "20px 0" }}>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "800",
                }}
              >
                Assignee
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <Avatar />
                <Typography>{`${
                  members.find((member) => parseInt(member.id) === assignee)
                    ?.first_name
                } ${
                  members.find((member) => parseInt(member.id) === assignee)
                    ?.last_name
                }`}</Typography>
              </Box>
            </Box>

            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "800",
                }}
              >
                Reviewer
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <Avatar />
                <Typography>
                  {`${
                    members.find((member) => parseInt(member.id) === reviewer)
                      ?.first_name
                  } ${
                    members.find((member) => parseInt(member.id) === reviewer)
                      ?.last_name
                  }`}
                </Typography>
              </Box>
            </Box>
          </Box>

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
            <form
              onSubmit={handleSubmit}
              style={{
                width: "100%",
                margin: "10px",
              }}
            >
              <TextField
                variant="filled"
                placeholder="Write a comment..."
                sx={{
                  width: "100%",
                }}
                inputRef={commentInputRef}
              />
            </form>
          </Box>
          {[...comments].reverse().map(
            (comment: commentType): JSX.Element => (
              <Box
                key={comment.creation_time}
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Avatar src="#" alt={comment.first_name} />
                <Box
                  sx={{
                    backgroundColor: "#eee",
                    flex: "1",
                    margin: "10px",
                    padding: "10px",
                  }}
                >
                  <Typography
                    sx={{
                      color: "primary.main",
                      textTransform: "capitalize",
                      fontWeight: "700",
                      fontSize: "1rem",
                    }}
                  >
                    {comment.first_name} {comment.last_name}
                  </Typography>
                  <Typography sx={{ fontSize: "0.9rem" }}>
                    {comment.comment_content}
                  </Typography>
                </Box>
              </Box>
            )
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskBody;
