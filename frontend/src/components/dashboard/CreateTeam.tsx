import { PropsWithChildren } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { FloatingLabelInput } from "../ui/floating-label-input";
import { Button } from "../ui/button";

type CreateTeamProps = PropsWithChildren;

const CreateTeam = ({ children }: CreateTeamProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Team</DialogTitle>
          <DialogDescription>
            Teams allow you to organize your boards and collaborate with others
            more effectively. Give your team a name to get started.
          </DialogDescription>
        </DialogHeader>
        <CreateTeamForm />
      </DialogContent>
    </Dialog>
  );
};

const CreateTeamForm = () => {
  return (
    <form className="w-full space-y-4">
      <FloatingLabelInput
        id="team-name"
        label="Team Name"
        className="dark:bg-background"
      />
      <div className="flex justify-end">
        <Button type="submit">Create</Button>
      </div>
    </form>
  );
};

export default CreateTeam;
