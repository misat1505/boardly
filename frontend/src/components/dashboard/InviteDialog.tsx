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
import { Button, buttonVariants } from "../ui/button";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import { searchUsers } from "@/actions/user/searchUsers";
import { User } from "@/types/User";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { RiUserAddFill } from "react-icons/ri";
import { inviteUser } from "@/actions/teams/inviteUser";

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
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users-search", { debouncedValue }],
    queryFn: () => searchUsers(debouncedValue),
    enabled: !!debouncedValue,
  });

  const memberIds = new Set(team.members.map((member) => member.id));
  const filteredUsers = (data ?? []).filter((user) => !memberIds.has(user.id));

  return (
    <div>
      <FloatingLabelInput
        id="invite"
        label="Search users"
        onChange={(e) => setSearchString(e.target.value)}
      />
      {isLoading && (
        <div className="text-sm text-muted-foreground text-center mt-4">
          Searching...
        </div>
      )}

      {filteredUsers.length > 0 && (
        <div className="flex flex-col space-y-2 mt-2">
          {filteredUsers.map((user) => (
            <SearchItem key={user.id} user={user} teamId={team.id} />
          ))}
        </div>
      )}

      {data && filteredUsers.length === 0 && (
        <div className="text-sm text-muted-foreground text-center mt-4">
          {data.length === 0
            ? "No users found."
            : "All found users are already in the team."}
        </div>
      )}

      {!debouncedValue && !isLoading && (
        <div className="text-sm text-muted-foreground/50 text-center mt-4">
          Start typing to search for users.
        </div>
      )}

      {isError && (
        <div className="text-sm text-red-500 text-center mt-4">
          Something went wrong.
        </div>
      )}
    </div>
  );
};

type SearchItemProps = { user: User; teamId: Team["id"] };

const SearchItem = ({ user, teamId }: SearchItemProps) => {
  return (
    <div className="flex items-center py-1 px-2 border border-muted-foreground/20 rounded-md justify-between">
      <div className="flex items-center space-x-2">
        <Avatar>
          <AvatarImage src={user.imageUrl} />
          <AvatarFallback>{user.username.toUpperCase()[0]}</AvatarFallback>
        </Avatar>
        <div>
          <div>{user.username}</div>
          <div className="text-xs text-muted-foreground/50">{user.email}</div>
        </div>
      </div>

      <Button title="Invite" onClick={() => inviteUser(teamId, user.id)}>
        <RiUserAddFill />
      </Button>
    </div>
  );
};

export default InviteDialog;
