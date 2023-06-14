import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

export type featureItem = {
  icon: ReactNode;
  title: string;
  description: string;
};

export const FeatureContainer = ({ icon, title, description }: featureItem) => {
  return (
    <Box
      sx={{
        backgroundColor: "rgba(255,255,255,0)",
        borderRadius: "10px",
        border: "1px solid #f00",
        margin: "20px 10px",
        padding: "40px 20px",
        transition: "300ms ease-in-out",
        height: "80%",

        "&:hover": {
          transform: "scale(1.03)",
        },
      }}
    >
      {icon}
      <Typography
        variant="h4"
        sx={{
          fontSize: "1.3rem",
          fontWeight: "600",
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="subtitle2"
        sx={{
          fontSize: "1rem",
          marginTop: "10px",
        }}
      >
        {description}
      </Typography>
    </Box>
  );
};
