import { ReactNode } from "react";
import Home from "./Home";
import Account from "@/components/Account";

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
    component: <Account />,
  },
  {
    title: "Sign Up",
    path: "/account/signup",
    component: <Account />,
  },
];
