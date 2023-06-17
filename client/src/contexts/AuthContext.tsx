import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/* eslint-disable */
type contextValueType = {
  auth: string | null;
  setAuth: React.Dispatch<React.SetStateAction<string | null>>;
};
const contextInitialValue: contextValueType = {
  auth: null,
  setAuth: () => {},
};
const AuthContext = createContext<contextValueType>(contextInitialValue);

type authContextProviderPropsType = {
  children: ReactNode;
};
export const AuthContextProvider = ({
  children,
}: authContextProviderPropsType) => {
  const [auth, setAuth] = useState<string | null>(null);
  const value = useMemo(() => ({ auth, setAuth }), [auth, setAuth]);

  useEffect(() => {
    if (auth) {
      localStorage.setItem("token", auth);
    } else {
      setAuth(localStorage.getItem("token"));
    }
  }, [auth, setAuth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
