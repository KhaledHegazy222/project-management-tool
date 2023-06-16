import { useCallback, SyntheticEvent, useState } from "react";
import Navbar from "../Navbar";
import {
  useLocation,
  Location,
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
import { StyledButton, StyledLink, StyledTextField } from "./Account.styled";
import accountBackground from "@/assets/images/accountBackground.jpg";
import { axiosServer } from "@/services";

type formDataType = {
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
  "confirm-password"?: string;
};
const formDataInitialValue: formDataType = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  "confirm-password": "",
};
type signupRequestBodyType = {
  mail: string;
  password: string;
  first_name: string;
  last_name: string;
};
type loginRequestBodyType = {
  mail: string;
  password: string;
};

const Account = () => {
  const navigate: NavigateFunction = useNavigate();
  const { pathname }: Location = useLocation();
  const login: boolean = pathname === "/account/login";

  const [formData, setFormData] = useState<formDataType>(formDataInitialValue);
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const name = e.target.name;
      const value = e.target.value;

      setFormData((formBody) => ({
        ...formBody,
        [name]: value,
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: SyntheticEvent) => {
      e.preventDefault();
      console.log(formData);

      if (login) {
        const requestBody: loginRequestBodyType = {
          mail: formData.email,
          password: formData.password,
        };
        console.log(requestBody);
        axiosServer.post("/");
      } else {
        const requestBody: signupRequestBodyType = {
          first_name: formData.first_name as string,
          last_name: formData.last_name as string,
          mail: formData.email,
          password: formData.password,
        };
        console.log(requestBody);
        axiosServer.post("/");
      }
    },
    [login, formData]
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
                fontSize: "5rem",
                fontWeight: "900",
                color: "black.main",
                background: "rgba(255,255,255,0.3)",
                padding: "50px",
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "60%",
              maxWidth: "400px",
            }}
          >
            <Typography variant="h4">Hey, hello 👋</Typography>
            <Typography variant="subtitle1">
              Enter the information you entered while registering .
            </Typography>

            <form onSubmit={handleSubmit}>
              {login ? (
                <>
                  <StyledTextField
                    type="email"
                    label="Email"
                    name="email"
                    onChange={handleChange}
                  />

                  <StyledTextField
                    type="password"
                    label="Password"
                    name="password"
                    onChange={handleChange}
                  />

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      margin: "10px 0",
                    }}
                  >
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Remember me"
                    />
                    <StyledLink to="/account/forget-password">
                      Forget Password ?
                    </StyledLink>
                  </Box>

                  <StyledLink to="/account/signup">
                    Don't have an account? Sign Up
                  </StyledLink>

                  <StyledButton type="submit">Login</StyledButton>
                </>
              ) : (
                <Grid container>
                  <Grid item xs={6} sx={{ paddingRight: "10px" }}>
                    <StyledTextField
                      type="text"
                      label="First Name"
                      name="first_name"
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={6} sx={{ paddingLeft: "10px" }}>
                    <StyledTextField
                      type="text"
                      label="Last Name"
                      name="last_name"
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <StyledTextField
                      type="email"
                      label="Email"
                      name="email"
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <StyledTextField
                      type="password"
                      label="Password"
                      name="password"
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <StyledTextField
                      type="password"
                      label="Confirm Password"
                      name="confirm-password"
                      onChange={handleChange}
                    />
                  </Grid>
                  <StyledLink to="/account/login">
                    Have already an account? Login
                  </StyledLink>
                  <StyledButton type="submit">Signup</StyledButton>
                </Grid>
              )}
            </form>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Account;
