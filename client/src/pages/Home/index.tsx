import { Box } from "@mui/material";
import Navbar from "@/components/Navbar";
import Features from "@/components/Home/Features";
import Hero from "@/components/Home/Hero";
import homeBackground from "@/assets/images/homeBackground.jpg";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AxiosError } from "axios";
import { axiosServer } from "@/services";
import { toast } from "react-toastify";
const Home = () => {
  const [searchParams] = useSearchParams();
  const activationCode = searchParams.get("activate");
  const { setAuth } = useAuth();
  const navigate = useNavigate();

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
    </>
  );
};

export default Home;
