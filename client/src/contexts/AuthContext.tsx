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
type contextValueType = {
  auth: string | null;
  setAuth: React.Dispatch<React.SetStateAction<string | null>>;
  logout: () => void;
};
const contextInitialValue: contextValueType = {
  auth: null,
  setAuth: () => {},
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
  const logout = useCallback(() => {
    setAuth(null);
    localStorage.removeItem("token");
  }, [setAuth]);
  const value = useMemo(
    () => ({ auth, setAuth, logout }),
    [auth, setAuth, logout]
  );

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
