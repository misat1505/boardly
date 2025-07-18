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
import CreateTeam from "./CreateTeam";

type TeamsNavigationProps = {
  teamId?: Team["id"];
};

const TeamsNavigation = async ({ teamId }: TeamsNavigationProps) => {
  const teams = await getUserTeams();

  const className = "w-56 border-r-1 border-r-muted-foreground/20 bg-muted";

  if (teams.length === 0)
    return (
      <section
        className={cn(
          className,
          "flex flex-col items-center justify-center px-4"
        )}
      >
        <h2 className="text-lg font-semibold">You have no teams</h2>
        <p className="mt-2 text-xs text-muted-foreground text-balance text-center">
          Start collaborating by creating a team.
        </p>
        <CreateTeam>
          <div className="mt-4 w-full">
            <Button className="hover:cursor-pointer w-full">Create Team</Button>
          </div>
        </CreateTeam>
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
          <AccordionTrigger className="hover:cursor-pointer hover:bg-secondary px-2 hover:no-underline text-primary-foreground">
            {selectedTeam.name}
          </AccordionTrigger>
          <AccordionContent>
            {sortedTeams.map((team) => (
              <Link
                key={team.id}
                href={`/dashboard?team=${team.id}`}
                className={cn(
                  "block w-[calc(100%-0.5rem)] bg-secondary/20 my-1 rounded-sm p-2 hover:bg-secondary/30 transition-colors mx-1 text-primary-foreground",
                  {
                    "bg-primary/80 hover:bg-primary/70": team.id === teamId,
                  }
                )}
              >
                <h2 className="font-bold">{team.name}</h2>
                <p className="text-xs text-muted-foreground/50">
                  {team.members.length} member
                  {team.members.length > 1 ? "(s)" : ""}
                </p>
              </Link>
            ))}
            <CreateTeam>
              <Button className="hover:cursor-pointer w-full">
                Create Team
              </Button>
            </CreateTeam>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
};

export default TeamsNavigation;
