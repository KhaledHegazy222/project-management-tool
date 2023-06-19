import { axiosServer } from "@/services";
import axios from "axios";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/* eslint-disable */

type userType = {
  id: string;
  mail: string;
  first_name: string;
  last_name: string;
};

type contextValueType = {
  loading: boolean;
  auth: string | null;
  setAuth: React.Dispatch<React.SetStateAction<string | null>>;
  user: userType | null;
  logout: () => void;
};
const contextInitialValue: contextValueType = {
  loading: true,
  auth: null,
  setAuth: () => {},
  user: null,
  logout: () => {},
};
const AuthContext = createContext<contextValueType>(contextInitialValue);

type authContextProviderPropsType = {
  children: ReactNode;
};
export const AuthContextProvider = ({
  children,
}: authContextProviderPropsType) => {
  const [auth, setAuth] = useState<string | null>(null);
  const [user, setUser] = useState<userType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setAuth(null);
    setUser(null);
  }, []);
  const value = useMemo(
    () => ({ loading, auth, setAuth, user, logout }),
    [loading, auth, setAuth, user, logout]
  );

  useEffect(() => {
    if (auth) {
      localStorage.setItem("token", auth);
    } else if (localStorage.getItem("token")) {
      setAuth(localStorage.getItem("token"));
    } else {
      setLoading(false);
    }
    if (auth) loadUser();

    async function loadUser() {
      setLoading(true);
      const response = await axiosServer.get("/details", {
        headers: { Authorization: `Bearer ${auth}` },
      });
      setUser({
        id: response.data.user_id,
        mail: response.data.mail,
        first_name: response.data.first_name,
        last_name: response.data.last_name,
      });
      setLoading(false);
    }
  }, [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
