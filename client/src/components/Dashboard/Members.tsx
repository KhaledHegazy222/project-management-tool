import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import MemberCard, { memberType } from "./MemberCard";
import { useAuth } from "@/contexts/AuthContext";
import { axiosServer } from "@/services";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";

const Members = () => {
  const { id } = useParams();

  const { auth } = useAuth();
  const [membersList, setMembersList] = useState<memberType[]>([]);

  useEffect(() => {
    loadData();
    async function loadData() {
      try {
        const response = await axiosServer.get(`/project/${id}/member`, {
          headers: { Authorization: `Bearer ${auth}` },
        });

        setMembersList(
          response.data.accepted.map(
            ({
              user_id,
              first_name,
              last_name,
              project_user_state,
            }: any): memberType => ({
              id: user_id,
              src: "/",
              first_name,
              last_name,
              bio: project_user_state,
            })
          )
        );
      } catch (error) {
        console.log((error as AxiosError).response?.data);
      }
    }
  }, [auth]);
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
