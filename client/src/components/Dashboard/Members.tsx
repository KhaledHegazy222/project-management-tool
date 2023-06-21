/* eslint-disable */
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import MemberCard, { memberType } from "./MemberCard";
import { useAuth } from "@/contexts/AuthContext";
import { axiosServer } from "@/services";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { ReactMultiEmail } from "react-multi-email";
import { toast } from "react-toastify";
import { useUpdates } from "@/contexts/UpdatesContext";

const Members = () => {
  const { id } = useParams();
  const { auth, user } = useAuth();

  const [addMembersDialogShow, setAddMembersDialogShow] =
    useState<boolean>(false);
  const [addedEmails, setAddedEmails] = useState<string[]>([]);
  const [membersList, setMembersList] = useState<memberType[]>([]);
  const { announceRequest } = useUpdates();
  const isOwner = useMemo(
    () =>
      membersList.some((member) => {
        return parseInt(member.id) === user?.id && member.role === "OWNER";
      }),
    [user, membersList]
  );
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (addedEmails.length === 0) {
        toast.error("You need to enter at least one email", {
          autoClose: 1000,
          position: "top-center",
        });
        return;
      }
      try {
        await axiosServer.post(
          `/project/${id}/member`,
          {
            members_mail: addedEmails,
          },
          { headers: { Authorization: `Bearer ${auth}` } }
        );
        announceRequest(addedEmails);
        setAddMembersDialogShow(false);
        toast.success("Inviation Sent Successfully");
      } catch (error) {
        console.log((error as AxiosError).response?.data);
        Array.from((error as any).response?.data.non_valid_mails).forEach(
          (email: any) => {
            toast.error(
              `${
                email.msg === "mail is not exist"
                  ? "Mail Doesn't Exist"
                  : email.msg
              } (${email.memberMail} )`
            );
          }
        );
      }
    },
    [id, addedEmails, auth, announceRequest]
  );
  useEffect(() => {
    loadData();
    async function loadData() {
      try {
        const response = await axiosServer.get(`/project/${id}/member`, {
          headers: { Authorization: `Bearer ${auth}` },
        });

        setMembersList(
          response.data.accepted.map(
            ({
              user_id,
              first_name,
              last_name,
              project_user_state,
            }: any): memberType => ({
              id: user_id,
              src: "/",
              first_name,
              last_name,
              role: project_user_state,
            })
          )
        );
      } catch (error) {
        console.log((error as AxiosError).response?.data);
      }
    }
  }, [auth, id]);
  return (
    <Box sx={{ padding: "0 40px" }}>
      <Typography
        variant="h3"
        sx={{
          textAlign: "center",
          fontSize: "2.6rem",
          marginBottom: "30px",
        }}
      >
        Members
      </Typography>
      <Grid
        container
        sx={{
          justifyContent: "center",
          justifyItems: "center",
        }}
      >
        {membersList.map((member) => (
          <Grid
            key={member.id}
            item
            xs="auto"
            sx={{
              padding: "10px",
            }}
          >
            <MemberCard {...member} />
          </Grid>
        ))}
        {isOwner && (
          <Grid
            item
            xs="auto"
            sx={{
              padding: "10px",
            }}
          >
            <Paper
              sx={{
                transition: "200ms ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <Button
                onClick={() => setAddMembersDialogShow(true)}
                sx={{
                  minWidth: "200px",
                  minHeight: "200px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Add
                  sx={{
                    fontSize: "4.5rem",
                    transition: "all 400ms ease-in-out",
                    "&:hover": {
                      color: "primary.main",
                    },
                  }}
                />
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>
      <Dialog
        open={addMembersDialogShow}
        onClose={() => setAddMembersDialogShow(false)}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "1.5rem",
                fontWeight: "600",
              }}
            >
              Add Members
            </Typography>
            <IconButton onClick={() => setAddMembersDialogShow(false)}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <ReactMultiEmail
              placeholder="Enter Invited Email Addresses"
              emails={addedEmails}
              style={{
                minWidth: "300px",
              }}
              onChange={(emails) => {
                setAddedEmails(emails);
              }}
              getLabel={(email, index, removeEmail) => {
                return (
                  <Box key={index} data-tag>
                    <Typography
                      sx={{
                        fontSize: "0.8rem",
                      }}
                    >
                      {email}
                    </Typography>
                    <IconButton
                      data-tag-handle
                      onClick={() => removeEmail(index)}
                    >
                      <Close
                        sx={{
                          fontSize: "1.1rem",
                        }}
                      />
                    </IconButton>
                  </Box>
                );
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              type="submit"
              sx={{
                textTransform: "none",
                fontSize: "1.1rem",
                fontWeight: "500",
                margin: "10px",
              }}
            >
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Members;
