import { useAuth } from "@/contexts/AuthContext";
import { FC, useEffect } from "react";

import { useNavigate } from "react-router-dom";

const WithAuth = (WrappedComponent: FC) => {
  const WithAuthComponent: FC = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
      if (!auth) navigate("/account/login");
    });

    return <WrappedComponent />;
  };
  return WithAuthComponent;
};
export default WithAuth;
