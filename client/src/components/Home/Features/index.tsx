import { Box, Grid, Typography } from "@mui/material";
import { FeatureContainer, featureItem } from "./FeatureContainer";
import useMQ from "@/Hooks/useMQ";

const featuresList: featureItem[] = [
  {
    icon: <></>,
    title: "Robust Task Creation",
    description:
      "Ngatur management provides users with a comprehensive set of tools to create, organize, and manage tasks effectively.",
  },
  {
    icon: <></>,
    title: "Collaboration Capabilities",
    description:
      "Ngatur management gives users the ability to assign tasks and collaborate with others, share task details, and track progress in real time.",
  },
  {
    icon: <></>,
    title: "Reminder Features",
    description:
      "These features should be customizable, allowing users to choose how and when they receive notifications.",
  },
  {
    icon: <></>,
    title: "Reporting and Analytics",
    description:
      "Ngatur management provides a variety of reporting and analytics options, such as task completion, time on task, team   productivity metrics.",
  },
  {
    icon: <></>,
    title: "Intuitive user interface",
    description:
      "An intuitive user interface is critical for a website management tasks, as it can significantly impact user adoption and productivity.",
  },
  {
    icon: <></>,
    title: "Integration with Other Tools",
    description:
      "A task management should integrate with other tools commonly used in the workspaces, such as calenders, email, and project management software.",
  },
];

const Features = () => {
  const { matchesLarge, matchesMedium } = useMQ();
  return (
    <Box
      sx={{
        minHeight: "100vh",
        padding: "50px 0",
      }}
    >
      <Box
        sx={{
          width: matchesMedium ? "80%" : "90%",
          margin: "auto",
        }}
      >
        <Box
          sx={{
            margin: matchesMedium ? "50px auto" : "0 auto",
            width: matchesMedium ? "700px" : "100%",
            color: "black",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            It does not end with <br />
            <Typography
              component="span"
              sx={{
                fontSize: "inherit",
                fontWeight: "inherit",
                background: (theme) =>
                  `-webkit-linear-gradient(0deg,${theme.palette.primary.main},${theme.palette.secondary.main})`,
                textTransform: "capitalize",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              project management
            </Typography>
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              textAlign: "center",
              fontSize: "1.1rem",
              margin: "20px",
              fontWeight: "600",
            }}
          >
            We're always improving the completed list by introducing new
            features to help your company grow in the feature
          </Typography>
        </Box>
        <Grid container>
          {featuresList.map((feature: featureItem) => (
            <Grid
              item
              xs={matchesLarge ? 4 : matchesMedium ? 6 : 12}
              key={feature.title}
            >
              <FeatureContainer {...feature} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Features;
