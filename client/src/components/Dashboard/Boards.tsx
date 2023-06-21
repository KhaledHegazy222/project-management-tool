import { useCallback, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import BoardBody from "./BoardBody";
import { taskType } from "./TaskBody";
import { useAuth } from "@/contexts/AuthContext";
import { AxiosError } from "axios";
import { axiosServer } from "@/services";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { useUpdates } from "@/contexts/UpdatesContext";

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
/* eslint-disable */
let announceTask: () => void, announceComment: (taskId: number) => void;
// announceRequest: () => void;
const Boards = () => {
  const { auth } = useAuth();
  const { id } = useParams();
  const {
    updatedProject,
    setUpdatedProject,
    setUpdatedTask,
    setUpdateRequests,
  } = useUpdates();
  const [tasks, setTasks] = useState<taskType[]>([]);

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
    if (parseInt(id as string) === updatedProject) {
      loadTasks();
      setUpdatedProject(null);
    }
  }, [id, loadTasks, updatedProject, setUpdatedProject]);
  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL, {
      transports: ["websocket"],
      query: {
        token: auth,
      },
    });
    announceTask = () => {
      socket.emit("send_task_changes", {
        projectId: id,
      });
    };
    socket.on("receive_task_changes", () => {
      loadTasks();
    });

    announceComment = (taskId: number) => {
      socket.emit("send_task_comment", {
        taskId,
        projectId: id,
      });
      setUpdatedProject(parseInt(id as string));
    };
    socket.on("receive_task_comment", (data) => {
      setUpdatedTask(data.taskId);
    });

    // announceRequest = (userId: number) => {
    //   socket.emit("send_user_invitation", {
    //     userId,
    //   });
    // };
    socket.on("receive_user_invitation", () => {
      setUpdateRequests(true);
    });
  }, [
    auth,
    id,
    loadTasks,
    setUpdatedProject,
    setUpdatedTask,
    setUpdateRequests,
  ]);
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
          />
        ))}
      </Box>
    </Box>
  );
};

export default Boards;
