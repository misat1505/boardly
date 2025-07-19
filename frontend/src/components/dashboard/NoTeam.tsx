import { Button } from "../ui/button";
import CreateTeam from "./CreateTeam";

const NoTeam = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center rounded-xl border border-muted-foreground/20 bg-muted/40 p-6 shadow-sm space-y-4">
      <h2 className="text-lg font-semibold text-primary">
        You&apos;re not part of any team yet
      </h2>
      <p className="text-sm text-muted-foreground max-w-xs">
        Teams help you collaborate and organize your work. Get started by
        creating your first team.
      </p>
      <CreateTeam>
        <Button>Create Team</Button>
      </CreateTeam>
    </div>
  );
};

export default NoTeam;
