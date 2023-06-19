import { Box, Typography } from "@mui/material";
import { useNavigate, NavigateFunction } from "react-router-dom";
import { StyledButton } from "./Hero.styled";
import homeMain from "@/assets/images/heroMain.png";
import useMQ from "@/Hooks/useMQ";
const Hero = () => {
  const navigate: NavigateFunction = useNavigate();
  const { matchesLarge, matchesSmall } = useMQ();
  return (
    <>
      <Box
        sx={{
          minHeight: "calc(100vh - 100px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: matchesLarge ? "nowrap" : "wrap",
          paddingTop: matchesLarge ? "0" : "15%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            width: matchesLarge ? "45%" : "95%",
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
                fontSize: matchesSmall ? "4rem" : "3rem",
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
                flexWrap: "wrap",
              }}
            >
              <StyledButton
                sx={{
                  backgroundColor: "white.main",
                  color: "primary.main",
                  "&:hover": {
                    backgroundColor: "white.main",
                    color: "primary.main",
                  },
                }}
                onClick={() => navigate("/account/signup")}
              >
                Sign up - it's free
              </StyledButton>
              <StyledButton
                sx={{
                  backgroundColor: "primary.main",
                  color: "white.main",
                  borderColor: "primary.main",
                  "&:hover": {
                    backgroundColor: "primary.main",
                    color: "white.main",
                  },
                }}
              >
                Learn more
              </StyledButton>
            </Box>
          </Box>
        </Box>
        <img
          src={homeMain}
          alt="Home"
          style={{
            padding: "4%",
            maxWidth: "100%",
          }}
        />
      </Box>
    </>
  );
};

export default Hero;
