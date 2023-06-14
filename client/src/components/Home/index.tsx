import { Box } from "@mui/material";
import Navbar from "../Navbar/Navbar";
import Features from "./Features/Features";
import Hero from "./Hero/Hero";
import homeBackground from "@/assets/images/homeBackground.jpg";
const Home = () => {
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
