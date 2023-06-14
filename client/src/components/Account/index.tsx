import { useCallback, SyntheticEvent } from "react";
import Navbar from "../Navbar";
import {
  useLocation,
  Location,
  Link,
  useNavigate,
  NavigateFunction,
} from "react-router-dom";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";
import { StyledButton, StyledTextField } from "./Account.styled";
import accountBackground from "@/assets/images/accountBackground.jpg";

const Account = () => {
  const { pathname }: Location = useLocation();
  const login: boolean = pathname === "/account/login";
  const navigate: NavigateFunction = useNavigate();

  const handleSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      if (login) {
        navigate("/");
      } else {
        navigate("/");
      }
    },
    [login, navigate]
  );

  return (
    <>
      <Navbar />
      <Grid
        container
        sx={{
          minHeight: "calc(100vh - 100px)",
        }}
      >
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundImage: `url(${accountBackground})`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        >
          <Box
            sx={{
              width: "80%",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: "5.5rem",
                fontWeight: "900",
                color: "black.main",
              }}
            >
              Digital Platform for project management.
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h4">Hey, hello 👋</Typography>
            <Typography variant="subtitle1">
              Enter the information you entered while registering .
            </Typography>
            <form onSubmit={handleSubmit}>
              {login ? (
                <>
                  <StyledTextField
                    id="email"
                    type="email"
                    label="Email"
                    sx={{
                      display: "block",
                      margin: "10px 0",
                    }}
                  />
                  <StyledTextField
                    id="password"
                    type="password"
                    label="Password"
                    sx={{
                      display: "block",
                    }}
                  />
                  <Box>
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Remember me"
                    />
                    <Link to="/account/forget-password">Forget Password</Link>
                  </Box>
                  <Link to="/account/signup"></Link>

                  <Typography>
                    Don't have an account yet,{" "}
                    <Link to="/account/signup"> Signup now.</Link>
                  </Typography>

                  <StyledButton type="submit">Login</StyledButton>
                </>
              ) : (
                <>
                  <StyledTextField
                    id="email"
                    type="email"
                    label="Email"
                    sx={{
                      display: "block",
                    }}
                  />
                  <StyledTextField
                    id="password"
                    type="password"
                    label="Password"
                    sx={{
                      display: "block",
                    }}
                  />
                  <StyledTextField
                    id="confirm-password"
                    type="password"
                    label="Confirm Password"
                    sx={{
                      display: "block",
                    }}
                  />
                  <Typography>
                    Already have an account,
                    <Link to="/account/login"> Login now.</Link>
                  </Typography>
                  <StyledButton type="submit">Signup</StyledButton>
                </>
              )}
            </form>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Account;
