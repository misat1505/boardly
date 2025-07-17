import { getUserTeams } from "@/actions/teams/getUserTeams";
import { cn } from "@/lib/utils";
import { Team } from "@/types/Team";
import { Button } from "../ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import Link from "next/link";

type TeamsNavigationProps = {
  teamId?: Team["id"];
};

const TeamsNavigation = async ({ teamId }: TeamsNavigationProps) => {
  const teams = await getUserTeams();

  const className = "w-56 border-r-1 border-r-muted-foreground/20 bg-sidebar";

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

  const selectedTeam = teams.find((t) => t.id === teamId) ?? teams[0];

  const sortedTeams = [
    selectedTeam,
    ...teams.filter((t) => t.id !== selectedTeam.id),
  ];

  return (
    <section className={cn(className, "p-2")}>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="hover:cursor-pointer hover:bg-secondary px-2 hover:no-underline">
            {selectedTeam.name}
          </AccordionTrigger>
          <AccordionContent>
            {sortedTeams.map((team) => (
              <Link
                key={team.id}
                href={`/dashboard?team=${team.id}`}
                className={cn(
                  "block w-[calc(100%-0.5rem)] bg-secondary/50 my-1 rounded-sm p-2 hover:bg-secondary transition-colors mx-1",
                  {
                    "bg-primary hover:bg-primary/90 text-primary-foreground":
                      team.id === teamId,
                  }
                )}
              >
                <h2 className="font-bold">{team.name}</h2>
                <p
                  className={cn("text-xs text-muted-foreground", {
                    "text-muted": team.id === teamId,
                  })}
                >
                  {team.members.length} member
                  {team.members.length > 1 ? "(s)" : ""}
                </p>
              </Link>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
};

export default TeamsNavigation;
