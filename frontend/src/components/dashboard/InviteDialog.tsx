"use client";
import { Team } from "@/types/Team";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { FloatingLabelInput } from "../ui/floating-label-input";
import { buttonVariants } from "../ui/button";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import { searchUsers } from "@/actions/user/searchUsers";

type InviteDialogProps = { team: Team };

const InviteDialog = ({ team }: InviteDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger className={buttonVariants({ variant: "default" })}>
        Invite
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite members to {team.name}</DialogTitle>
          <DialogDescription>
            Add people to your team so they can collaborate on your boards.
          </DialogDescription>
        </DialogHeader>

        <InviteDialogContent team={team} />
      </DialogContent>
    </Dialog>
  );
};

type InviteDialogContentProps = { team: Team };

const InviteDialogContent = ({ team }: InviteDialogContentProps) => {
  const [searchString, setSearchString] = useState("");
  const [debouncedValue] = useDebounce(searchString, 300);
  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => searchUsers(debouncedValue),
    enabled: !!debouncedValue,
  });

  return (
    <div>
      <FloatingLabelInput
        id="invite"
        label="Search users"
        onChange={(e) => setSearchString(e.target.value)}
      />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default InviteDialog;
