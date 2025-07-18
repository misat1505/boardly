import { Team } from "@/types/Team";
import TeamBoards from "./TeamBoards";
import { Badge } from "../ui/badge";
import { BadgeCheckIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { Board } from "@/types/Board";
import { getTeamBoards } from "@/actions/teams/getTeamBoards";

type TeamDetailsProps = { team: Team };

const TeamDetails = async ({ team }: TeamDetailsProps) => {
  const boards = await getTeamBoards(team.id);

  return (
    <div className="px-4 pt-4">
      <TeamInfo team={team} boards={boards} />
      {/* <section>{JSON.stringify(team, null, 2)}</section> */}
      <TeamBoards boards={boards} />
    </div>
  );
};

type TeamInfoProps = {
  team: Team;
  boards: Board[];
};

const TeamInfo = ({ team, boards }: TeamInfoProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center space-x-4">
        <h2 className="font-bold text-xl">{team.name}</h2>
        <div className="flex items-center space-x-2">
          {team.isUpgraded ? (
            <Badge variant="default" className="text-white font-bold">
              <BadgeCheckIcon />
              PRO
            </Badge>
          ) : (
            <Badge variant="outline" className="font-semibold">
              Basic
            </Badge>
          )}
          <Badge variant="outline" className="font-semibold">
            {team.members.length} member{team.members.length > 1 ? "s" : ""}
          </Badge>
          <Badge variant="outline" className="font-semibold">
            {boards.length} board{boards.length > 1 ? "s" : ""}
          </Badge>
        </div>
      </div>
      {!team.isUpgraded ? (
        <Link
          className={cn(
            buttonVariants({
              variant: "link",
            }),
            "text-yellow-600 text-xs p-0 h-fit"
          )}
          href="#"
        >
          Upgrade this team to be able to create unlimited number of boards!
        </Link>
      ) : null}
    </div>
  );
};

export default TeamDetails;
