import React from "react";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import MemberCard, { memberType } from "./MemberCard";

const membersList: memberType[] = [
  {
    id: "1",
    src: "/",
    first_name: "Khaled",
    last_name: "Leader",
    bio: "Hello World",
  },
  {
    id: "2",
    src: "/",
    first_name: "Khaled",
    last_name: "Leader",
    bio: "Hello World",
  },
  {
    id: "3",
    src: "/",
    first_name: "Khaled",
    last_name: "Leader",
    bio: "Hello World",
  },
  {
    id: "4",
    src: "/",
    first_name: "Khaled",
    last_name: "Leader",
    bio: "Hello World",
  },
  {
    id: "5",
    src: "/",
    first_name: "Khaled",
    last_name: "Leader",
    bio: "Hello World",
  },
  {
    id: "6",
    src: "/",
    first_name: "Khaled",
    last_name: "Leader",
    bio: "Hello World",
  },
  {
    id: "7",
    src: "/",
    first_name: "Khaled",
    last_name: "Leader",
    bio: "Hello World",
  },
];

const Members = () => {
  return (
    <Box sx={{ padding: "0 40px" }}>
      <Typography
        variant="h3"
        sx={{
          textAlign: "center",
          fontSize: "2.6rem",
          marginBottom: "30px",
        }}
      >
        Members
      </Typography>
      <Grid container>
        {membersList.map((member) => (
          <Grid
            key={member.id}
            item
            xs={3}
            sx={{
              padding: "10px",
            }}
          >
            <MemberCard {...member} />
          </Grid>
        ))}
        <Grid
          item
          xs={3}
          sx={{
            padding: "10px",
          }}
        >
          <Paper
            sx={{
              height: "100%",
              transition: "200ms ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <Button
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <Add
                sx={{
                  fontSize: "4.5rem",
                  transition: "all 400ms ease-in-out",
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              />
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Members;
