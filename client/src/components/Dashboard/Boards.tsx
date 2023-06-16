import React from "react";
import { Box, Fab, Typography } from "@mui/material";
import BoardBody, { boardType } from "./BoardBody";
import { Add } from "@mui/icons-material";
const boards: boardType[] = [
  {
    name: "New Request",
    color: "#ff0000",
    tasks: [
      {
        name: `Presentation for Dribble`,
        description:
          "Approved the design of the iOS app,let's make a presentation.",
        labels: [],
        state: "Todo",
        assignee: "Khaled Hegazy",
        reviewer: "Khaled Leader",
        deadLine: "11/11/2020",
        comments: [],
      },
      {
        name: `Home page bugs fixes`,
        description:
          "I found several mistakes. Made a list, attached it below.",
        labels: [],
        state: "Todo",
        assignee: "Khaled Hegazy",
        reviewer: "Khaled Leader",
        deadLine: "11/11/2020",
        comments: [],
      },
    ],
  },
  {
    name: "In Progress",
    color: "#0000ff",
    tasks: [
      {
        name: `Planning meeting for the second version of the app`,
        labels: [],
        state: "Todo",
        assignee: "Khaled Hegazy",
        reviewer: "Khaled Leader",
        deadLine: "11/11/2020",
        comments: [],
      },
      {
        name: `Secret Marketing Page`,
        description:
          "We need to make a page for a special offer for the most loyal customers.",
        labels: [],
        state: "Todo",
        assignee: "Khaled Hegazy",
        reviewer: "Khaled Leader",
        deadLine: "11/11/2020",
        comments: [],
      },
    ],
  },
  {
    name: "On Review",
    color: "#00ff00",
    tasks: [
      {
        name: `Second design concept`,
        description:
          "Let's do the exact opposite of the first concept. Light theme, minimalism and lightness.",
        labels: [],
        state: "Todo",
        assignee: "Khaled Hegazy",
        reviewer: "Khaled Leader",
        deadLine: "11/11/2020",
        comments: [],
      },
      {
        name: `Do competitor research`,
        description:
          "You need to research competitors and identify weaknesses and strengths each of them.",
        labels: [],
        state: "Todo",
        assignee: "Khaled Hegazy",
        reviewer: "Khaled Leader",
        deadLine: "11/11/2020",
        comments: [],
      },
      {
        name: `First Design Concept`,
        description:
          "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aut minus ipsum architecto dolorum.",
        labels: [],
        state: "Todo",
        assignee: "Khaled Hegazy",
        reviewer: "Khaled Leader",
        deadLine: "11/11/2020",
        comments: [],
      },
      {
        name: "Lorem ipsum dolor sit amet",
        description:
          "Fugit cumque maiores, est, qui, sequi enim consectetur ea veniam facere. Aliquam cum natus vel aperiam nihil.",
        labels: [],
        state: "Todo",
        assignee: "Khaled Hegazy",
        reviewer: "Khaled Leader",
        deadLine: "11/11/2020",
        comments: [],
      },
    ],
  },
  {
    name: "Complete",
    color: "#ffff00",
    tasks: [],
  },
];

const Boards = () => {
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
        {boards.map((board: boardType) => (
          <BoardBody {...board} />
        ))}
      </Box>

      <Box
        sx={{
          position: "fixed",
          right: "5%",
          bottom: "5%",
        }}
      >
        <Fab
          variant="extended"
          sx={{
            backgroundColor: "primary.main",
            color: "white.main",
            transition: "all 200ms ease-in-out",
            "&:hover": {
              backgroundColor: "primary.main",
              color: "white.main",
              transform: "scale(1.05)",
            },
          }}
        >
          <Add sx={{ fontSize: "2rem", fontWeight: "inherit" }} />
          <Typography
            sx={{
              margin: "0 10px",
              textTransform: "none",
              fontSize: "1.2rem",
            }}
          >
            New Project
          </Typography>
        </Fab>
      </Box>
    </Box>
  );
};

export default Boards;
