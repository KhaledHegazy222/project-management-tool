import React from "react";
import { Avatar, Card, CardContent, Typography } from "@mui/material";
import avatarImage from "@/assets/images/avatar.avif";

export type memberType = {
  id: string;
  src: string;
  first_name: string;
  last_name: string;
  role: string;
};

const MemberCard = ({ id, src, first_name, last_name, role }: memberType) => {
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
        <Avatar sx={{ margin: "30px auto" }} alt="User" src={avatarImage} />
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
        >{`${role}`}</Typography>
      </CardContent>
    </Card>
  );
};

export default MemberCard;
