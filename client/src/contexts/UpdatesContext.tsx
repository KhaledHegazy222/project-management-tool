import { ReactNode, createContext, useContext, useMemo, useState } from "react";

type updatesContextType = {
  updatedTask: number | null;
  setUpdatedTask: React.Dispatch<React.SetStateAction<number | null>>;
  updatedProject: number | null;
  setUpdatedProject: React.Dispatch<React.SetStateAction<number | null>>;
  updateStars: boolean;
  setUpdateStars: React.Dispatch<React.SetStateAction<boolean>>;
};

const updatesContextInitialValue: updatesContextType = {
  updatedTask: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUpdatedTask: () => {},
  updatedProject: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUpdatedProject: () => {},
  updateStars: true,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUpdateStars: () => {},
};

const updatesContext = createContext(updatesContextInitialValue);

export const UpdatesContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [updatedTask, setUpdatedTask] = useState<number | null>(null);
  const [updatedProject, setUpdatedProject] = useState<number | null>(null);
  const [updateStars, setUpdateStars] = useState<boolean>(true);

  const value = useMemo(
    () => ({
      updatedTask,
      setUpdatedTask,
      updatedProject,
      setUpdatedProject,
      updateStars,
      setUpdateStars,
    }),
    [
      updatedTask,
      setUpdatedTask,
      updatedProject,
      setUpdatedProject,
      updateStars,
      setUpdateStars,
    ]
  );

  return (
    <updatesContext.Provider value={value}>{children}</updatesContext.Provider>
  );
};

export const useUpdates = () => useContext(updatesContext);
