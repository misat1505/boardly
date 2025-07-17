import { getUserTeams } from "@/actions/teams/getUserTeams";
import { cn } from "@/lib/utils";
import { Team } from "@/types/Team";
import { Button } from "../ui/button";

type TeamsNavigationProps = {
  teamId?: Team["id"];
};

const TeamsNavigation = async ({ teamId }: TeamsNavigationProps) => {
  const teams = await getUserTeams();

  const className = "w-56 border-r-1 border-r-muted-foreground/20";

  if (teams.length === 0)
    return (
      <section
        className={cn(
          className,
          "flex flex-col items-center justify-center px-4"
        )}
      >
        <h2 className="text-lg font-semibold">You have no teams</h2>
        <p className="mt-2 text-sm text-muted-foreground text-balance text-center">
          Start collaborating by creating a team.
        </p>
        <Button className="mt-4 w-full hover:cursor-pointer">
          Create Team
        </Button>
      </section>
    );

  return <section className={className}></section>;
};

export default TeamsNavigation;
