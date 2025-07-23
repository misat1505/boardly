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

        <FloatingLabelInput id="invite" label="Search users" />
      </DialogContent>
    </Dialog>
  );
};

export default InviteDialog;
