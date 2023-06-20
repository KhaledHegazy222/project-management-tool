import React, { FormEvent, useRef, useState } from "react";
import TaskBody, { taskType } from "./TaskBody";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import CustomBadge from "./CustomBadge";
import { useParams } from "react-router-dom";
import { StyledTextField } from "./Boards.styled";
import useProjectMembers from "@/Hooks/useProjectMembers";
import { memberType } from "./MemberCard";
import axios, { Axios, AxiosError } from "axios";
import { axiosServer } from "@/services";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

export type boardType = {
  name: string;
  color: string;
  tasks: taskType[];
};

const BoardBody = ({
  name,
  color,
  tasks,
  addButton = false,
  loadTasks,
  announceTask,
  announceComment,
  updatedTask,
  setUpdatedTask,
}: boardType & any) => {
  const { auth } = useAuth();
  const { id } = useParams();
  const [addNewTaskShow, setAddNewTaskShow] = useState<boolean>(false);
  const [loading, members] = useProjectMembers(parseInt(id as string));

  const taskNameInputRef = useRef<HTMLInputElement | null>(null);
  const taskDescriptionInputRef = useRef<HTMLInputElement | null>(null);

  const [assignee, setAssignee] = useState<number>(-1);
  const [reviewer, setReviewer] = useState<number>(-1);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const requestBody = {
        project_id: id,
        task_title: taskNameInputRef.current?.value,
        task_description: taskDescriptionInputRef.current?.value,
        task_state: "New Request",
        task_assignee_id: assignee,
        task_reviewer_id: reviewer,
        task_due_date: "2024-05-20",
      };
      await axiosServer.post(
        "/task/create",
        {
          ...requestBody,
        },
        {
          headers: { Authorization: `Bearer ${auth}` },
        }
      );
      toast.success("Task Created Successfully", {
        autoClose: 1000,
        position: "top-center",
      });
      loadTasks();
      announceTask();
      setAddNewTaskShow(false);
    } catch (error) {
      console.log((error as AxiosError).response?.data);
    }
  };

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
        <Typography
          variant="h6"
          sx={{
            fontWeight: "600",
          }}
        >
          {name}
        </Typography>
      </Box>
      <List>
        {addButton && (
          <Paper>
            <ListItemButton
              onClick={() => {
                setAddNewTaskShow(true);
              }}
              sx={{
                color: "black.main",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": {
                  backgroundColor: "primary.main",
                  color: "white.main",
                },
              }}
            >
              <Add />
              <Typography> New Task</Typography>
            </ListItemButton>
          </Paper>
        )}

        {tasks.map((task: taskType) => (
          <Paper key={task.name}>
            <ListItem
              sx={{
                margin: "10px 0",
                borderRadius: "10px",
                "&:hover": {
                  background: "rgba(0,0,0,0.05)",
                },
              }}
            >
              <TaskBody
                {...task}
                announceComment={announceComment}
                updatedTask={updatedTask}
                setUpdatedTask={setUpdatedTask}
              />
            </ListItem>
          </Paper>
        ))}
      </List>
      {!loading && (
        <Dialog open={addNewTaskShow} onClose={() => setAddNewTaskShow(false)}>
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "1.5rem",
                fontWeight: "700",
              }}
            >
              Add new Task
            </Typography>
            <IconButton
              onClick={() => setAddNewTaskShow(false)}
              sx={{ marginLeft: "20px" }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <StyledTextField
                type="text"
                label="Task Name"
                variant="outlined"
                required={true}
                inputRef={taskNameInputRef}
              />
              <StyledTextField
                type="text"
                label="Description"
                variant="outlined"
                required={true}
                inputRef={taskDescriptionInputRef}
              />
              <FormControl fullWidth>
                <InputLabel id="assignee-input-label"> Assignee </InputLabel>
                <Select
                  labelId="assignee-input-label"
                  label="Assignee"
                  required={true}
                  value={assignee || -1}
                  onChange={(e: SelectChangeEvent<number>) => {
                    setAssignee(parseInt(e.target.value as string));
                  }}
                  sx={{
                    margin: "10px 0",
                  }}
                >
                  {" "}
                  <MenuItem value={-1}>None</MenuItem>
                  {members.map(
                    (member: memberType): JSX.Element => (
                      <MenuItem value={member.id} key={member.id}>
                        {`${member.first_name} ${member.last_name}`}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="reviewer-input-label"> Reviewer </InputLabel>
                <Select
                  labelId="reviewer-input-label"
                  label="Reviewer"
                  required={true}
                  value={reviewer || -1}
                  onChange={(e: SelectChangeEvent<number>) => {
                    setReviewer(parseInt(e.target.value as string));
                  }}
                >
                  {" "}
                  <MenuItem value={-1}>None</MenuItem>
                  {members.map(
                    (member: memberType): JSX.Element => (
                      <MenuItem value={member.id} key={member.id}>
                        {`${member.first_name} ${member.last_name}`}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  margin: "10px",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  textTransform: "none",
                }}
              >
                Add
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      )}
    </Box>
  );
};

export default BoardBody;
