import { Box, Typography } from "@mui/material";
import { StyledButton } from "./Hero.styled";
import homeMain from "@/assets/images/heroMain.png";
const Hero = () => {
  return (
    <>
      <Box
        sx={{
          minHeight: "calc(100vh - 100px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            width: "45%",
          }}
        >
          <Box
            sx={{
              color: "black",
              margin: "auto",
            }}
          >
            <Typography
              sx={{
                fontSize: "4rem",
                textAlign: "center",
                fontWeight: "900",
              }}
            >
              Ngatur helps team move work together forward
            </Typography>
            <Typography
              sx={{
                margin: "40px auto",
                fontSize: "1.1rem",
                textAlign: "center",
                width: "80%",
              }}
            >
              Collaborate, manage projects, and reach new productivity peaks.
              From high rises to the home office, the way your team works is
              unique. Accomplish it all with Ngatur.
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: "20px",
              }}
            >
              <StyledButton
                sx={{
                  backgroundColor: "secondary.main",
                  color: "primary.main",
                  "&:hover": {
                    backgroundColor: "secondary.main",
                    color: "primary.main",
                  },
                }}
              >
                Sign up - it's free
              </StyledButton>
              <StyledButton
                sx={{
                  backgroundColor: "primary.main",
                  color: "secondary.main",
                  borderColor: "primary.main",
                  "&:hover": {
                    backgroundColor: "primary.main",
                    color: "secondary.main",
                  },
                }}
              >
                Learn more
              </StyledButton>
            </Box>
          </Box>
        </Box>
        <img src={homeMain} alt="Home" />
      </Box>
    </>
  );
};

export default Hero;