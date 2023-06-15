import React from "react";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

export type memberType = {
  id: string;
  src: string;
  first_name: string;
  last_name: string;
  bio: string;
};

const MemberCard = ({ id, src, first_name, last_name, bio }: memberType) => {
  return (
    <Card
      sx={{
        transition: "all 200ms ease-in-out",
        cursor: "pointer",
        "&:hover": {
          transform: "scale(1.04)",
        },
      }}
    >
      <CardContent>
        <Avatar sx={{ margin: "30px auto" }} />
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
          }}
        >{`${first_name} ${last_name}`}</Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: "gray",
            fontSize: "0.8rem",
            textAlign: "center",
          }}
        >{`${bio}`}</Typography>
      </CardContent>
    </Card>
  );
};

export default MemberCard;
