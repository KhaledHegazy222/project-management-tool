import { ReactNode, createContext, useContext, useMemo, useState } from "react";

type updatesContextType = {
  updatedTask: number | null;
  setUpdatedTask: React.Dispatch<React.SetStateAction<number | null>>;
  updatedProject: number | null;
  setUpdatedProject: React.Dispatch<React.SetStateAction<number | null>>;
};

const updatesContextInitialValue: updatesContextType = {
  updatedTask: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUpdatedTask: () => {},
  updatedProject: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUpdatedProject: () => {},
};

const updatesContext = createContext(updatesContextInitialValue);

export const UpdatesContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [updatedTask, setUpdatedTask] = useState<number | null>(null);
  const [updatedProject, setUpdatedProject] = useState<number | null>(null);

  const value = useMemo(
    () => ({
      updatedTask,
      setUpdatedTask,
      updatedProject,
      setUpdatedProject,
    }),
    [updatedTask, setUpdatedTask, updatedProject, setUpdatedProject]
  );

  return (
    <updatesContext.Provider value={value}>{children}</updatesContext.Provider>
  );
};

export const useUpdates = () => useContext(updatesContext);
