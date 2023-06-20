import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import BoardBody, { boardType } from "./BoardBody";
import { taskType } from "./TaskBody";
import { useAuth } from "@/contexts/AuthContext";
import axios, { Axios, AxiosError } from "axios";
import { axiosServer } from "@/services";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

type categoryType = {
  name: string;
  color: string;
};

const boardCategories: categoryType[] = [
  {
    name: "New Request",
    color: "#f00",
  },

  {
    name: "In Progress",
    color: "#ff0",
  },

  {
    name: "On Review",
    color: "#f0f",
  },

  {
    name: "Complete",
    color: "#0f0",
  },
];
let announceTask: any, announceComment: any;
const Boards = () => {
  const { auth } = useAuth();
  const { id } = useParams();
  const [tasks, setTasks] = useState<taskType[]>([]);
  const [updatedTask, setUpdatedTask] = useState<number | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      const response = await axiosServer.get(`/task/project/${id}`, {
        headers: { Authorization: `Bearer ${auth}` },
      });
      setTasks(
        response.data.map(
          (task: any): taskType => ({
            id: task.task_id,
            projectId: task.project_id,
            name: task.task_title,
            description: task.task_description,
            state: task.task_state,
            assignee: task.task_assignee_id,
            reviewer: task.task_reviewer_id,
            deadLine: task.task_due_date,
          })
        )
      );
    } catch (error) {
      console.log((error as AxiosError).response?.data);
    }
  }, [id, auth]);
  useEffect(() => {
    loadTasks();
  }, [auth, id, loadTasks]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL, {
      transports: ["websocket"],
      query: {
        token: auth,
        projectId: id,
      },
    });
    announceTask = () => {
      socket.emit("send_create_task");
    };

    announceComment = (taskId: number) => {
      socket.emit("send_task_comment", {
        taskId,
      });
      setUpdatedTask(taskId);
    };
    socket.on("receive_task_create", (data) => {
      loadTasks();
    });
    socket.on("receive_task_comment", (data) => {
      setUpdatedTask(data.taskId);
    });
  }, [auth, id, loadTasks]);
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          fontSize: "2.4rem",
          textAlign: "center",
        }}
      >
        Boards
      </Typography>
      <Box
        sx={{
          marginTop: "30px",
          display: "flex",
          height: "700px",
          overflow: "auto",
        }}
      >
        {boardCategories.map((category, index) => (
          <BoardBody
            key={category.name}
            name={category.name}
            color={category.color}
            tasks={tasks.filter((task) => task.state === category.name)}
            addButton={!index}
            loadTasks={loadTasks}
            announceTask={announceTask}
            announceComment={announceComment}
            updatedTask={updatedTask}
            setUpdatedTask={setUpdatedTask}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Boards;
