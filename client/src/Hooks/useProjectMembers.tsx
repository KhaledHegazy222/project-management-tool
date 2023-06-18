import { memberType } from "@/components/Dashboard/MemberCard";
import { useAuth } from "@/contexts/AuthContext";
import { axiosServer } from "@/services";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

const useProjectMembers = (projectID: number): [boolean, memberType[]] => {
  const { auth } = useAuth();
  const [members, setMembers] = useState<memberType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadMembers();
    async function loadMembers() {
      try {
        const response = await axiosServer.get(`/project/${projectID}/member`, {
          headers: { Authorization: `Bearer ${auth}` },
        });
        console.log();
        setMembers(
          response.data.accepted.map(
            (member: {
              user_id: number;
              first_name: string;
              last_name: string;
              project_user_state: string;
            }): memberType => ({
              id: member.user_id.toString(),
              first_name: member.first_name,
              last_name: member.last_name,
              src: "#",
              role: member.project_user_state,
            })
          )
        );
        setLoading(false);
      } catch (error) {
        console.log((error as AxiosError).response?.data);
      }
    }
  }, [projectID, auth]);

  return [loading, members];
};

export default useProjectMembers;
