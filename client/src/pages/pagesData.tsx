import { ReactNode } from "react";
import Home from "./Home";
import Account from "@/components/Account";
import Dashboard from "@/components/Dashboard";
import { UpdatesContextProvider } from "@/contexts/UpdatesContext";

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
  {
    title: "Forget Password",
    path: "/account/forget-password",
    component: <Account />,
  },

  {
    title: "Dashboard",
    path: "/dashboard/*",
    component: (
      <UpdatesContextProvider>
        <Dashboard />
      </UpdatesContextProvider>
    ),
  },
];
