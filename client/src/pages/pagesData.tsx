import { ReactNode } from "react";
import Home from "./Home";

export type pageEntry = {
  title: string;
  path: string;
  component: ReactNode;
};

export const pagesData: pageEntry[] = [
  {
    title: "Home",
    path: "/",
    component: <Home />,
  },
  {
    title: "Login",
    path: "/account/login",
    component: <></>,
  },
  {
    title: "Sign Up",
    path: "/account/signup",
    component: <></>,
  },
];
