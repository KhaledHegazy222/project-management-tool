import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import Navbar from "@/components/Navbar";
import Features from "@/components/Home/Features";
import Hero from "@/components/Home/Hero";
import homeBackground from "@/assets/images/homeBackground.jpg";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AxiosError } from "axios";
import { axiosServer } from "@/services";
import { toast } from "react-toastify";
const Home = () => {
  const [searchParams] = useSearchParams();
  const activationCode = searchParams.get("activate");
  const resetCode = searchParams.get("reset");
  const [showResetDialog, setShowResetDialog] = useState(false);
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const resetPasswordInputRef = useRef<HTMLInputElement | null>(null);
  const confirmResetPasswordInputRef = useRef<HTMLInputElement | null>(null);
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (
        resetPasswordInputRef.current?.value !==
        confirmResetPasswordInputRef.current?.value
      ) {
        toast.error("Passwords Doesn't match", {
          autoClose: 1000,
          position: "top-center",
        });
        return;
      }

      const password = resetPasswordInputRef.current?.value;
      try {
        axiosServer.post(`/reset_password/${resetCode}`, {
          password,
        });
        toast.success("Password Resets Successfully", {
          autoClose: 1000,
          position: "top-center",
        });
        navigate("/account/login");
      } catch (error) {
        console.log((error as AxiosError).response?.data);
      }
    },
    [resetCode, navigate]
  );
  useEffect(() => {
    if (activationCode) {
      activateAccount();
    }
    async function activateAccount() {
      try {
        const response = await axiosServer.post(`/verify/${activationCode}`);
        setAuth(response.data.token);
        toast.success("Your account has been successfully activated");
        navigate("/dashboard");
      } catch (error) {
        console.log((error as AxiosError).response?.data);
      }
    }
  }, [activationCode, setAuth, navigate]);

  useEffect(() => {
    if (resetCode) {
      setShowResetDialog(true);
    }
  }, [resetCode]);

  return (
    <>
      <Box
        sx={{
          backgroundImage: `url(${homeBackground})`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "right 10% bottom 20%",
        }}
      >
        <Navbar />
        <Hero />
        <Features />
      </Box>

      <Dialog open={showResetDialog}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogContent>
            <TextField
              type="password"
              label="Password"
              sx={{
                display: "block",
                margin: "10px",
              }}
              inputRef={resetPasswordInputRef}
            />
            <TextField
              type="password"
              label="Confirm Password"
              sx={{
                display: "block",
                margin: "10px",
              }}
              inputRef={confirmResetPasswordInputRef}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              type="submit"
              sx={{ margin: "10px", fontSize: "1rem", fontWeight: "600" }}
            >
              Reset
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default Home;
