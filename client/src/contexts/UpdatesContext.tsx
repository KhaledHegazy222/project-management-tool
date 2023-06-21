import { ReactNode, createContext, useContext, useMemo, useState } from "react";

type updatesContextType = {
  updatedTask: number | null;
  setUpdatedTask: React.Dispatch<React.SetStateAction<number | null>>;
  updatedProject: number | null;
  setUpdatedProject: React.Dispatch<React.SetStateAction<number | null>>;
  updateStars: boolean;
  setUpdateStars: React.Dispatch<React.SetStateAction<boolean>>;
  updateRequests: boolean;
  setUpdateRequests: React.Dispatch<React.SetStateAction<boolean>>;
  announceTask: () => void;
  setAnnounceTask: React.Dispatch<React.SetStateAction<() => void>>;
  announceComment: (taskId: number) => void;
  setAnnounceComment: React.Dispatch<
    React.SetStateAction<(taskId: number) => void>
  >;
  announceRequest: (emails: string[]) => void;
  setAnnounceRequest: React.Dispatch<
    React.SetStateAction<(emails: string[]) => void>
  >;
};
/*eslint-disable */
const updatesContextInitialValue: updatesContextType = {
  updatedTask: null,
  setUpdatedTask: () => {},
  updatedProject: null,
  setUpdatedProject: () => {},
  updateStars: true,
  setUpdateStars: () => {},
  updateRequests: true,
  setUpdateRequests: () => {},
  announceTask: () => {},
  setAnnounceTask: () => {},
  announceComment: () => {},
  setAnnounceComment: () => {},
  announceRequest: () => {},
  setAnnounceRequest: () => {},
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
  const [updateRequests, setUpdateRequests] = useState<boolean>(true);

  const [announceTask, setAnnounceTask] = useState<() => void>(() => {}); // Corrected type
  const [announceComment, setAnnounceComment] = useState<
    (taskId: number) => void
  >((taskId: number) => {});
  const [announceRequest, setAnnounceRequest] = useState<
    (emails: string[]) => void
  >((emails: string[]) => {});

  const value = useMemo(
    () => ({
      updatedTask,
      setUpdatedTask,
      updatedProject,
      setUpdatedProject,
      updateStars,
      setUpdateStars,
      updateRequests,
      setUpdateRequests,
      announceTask,
      setAnnounceTask,
      announceComment,
      setAnnounceComment,
      announceRequest,
      setAnnounceRequest,
    }),
    [
      updatedTask,
      setUpdatedTask,
      updatedProject,
      setUpdatedProject,
      updateStars,
      setUpdateStars,
      updateRequests,
      setUpdateRequests,
      announceTask,
      setAnnounceTask,
      announceComment,
      setAnnounceComment,
      announceRequest,
      setAnnounceRequest,
    ]
  );

  return (
    <updatesContext.Provider value={value}>{children}</updatesContext.Provider>
  );
};

export const useUpdates = () => useContext(updatesContext);
