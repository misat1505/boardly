import { Team } from "@/types/Team";
import TeamBoards from "./TeamBoards";
import { Badge } from "../ui/badge";
import { BadgeCheckIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { Board } from "@/types/Board";
import { getTeamBoards } from "@/actions/teams/getTeamBoards";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import InviteDialog from "./InviteDialog";

type TeamDetailsProps = { team: Team };

const TeamDetails = async ({ team }: TeamDetailsProps) => {
  const boards = await getTeamBoards(team.id);

  return (
    <div className="px-4 pt-4">
      <div className="mb-8">
        <TeamInfo team={team} boards={boards} />
      </div>
      <div className="mb-8">
        <TeamBoards team={team} boards={boards} />
      </div>
      <div className="mb-8">
        <Members team={team} />
      </div>
    </div>
  );
};

type TeamInfoProps = {
  team: Team;
  boards: Board[];
};

const TeamInfo = ({ team, boards }: TeamInfoProps) => {
  return (
    <div>
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
          Upgrade your team to create as many boards as you need—no limits!
        </Link>
      ) : null}
    </div>
  );
};

type MembersProps = { team: Team };

const Members = ({ team }: MembersProps) => {
  return (
    <section className="">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl">Members ({team.members.length})</h2>
        <InviteDialog team={team} />
      </div>
      <Table className="text-muted-foreground">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Premium</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {team.members.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={user.imageUrl} alt={user.username} />
                  <AvatarFallback>
                    {user.username.toUpperCase()[0]}
                  </AvatarFallback>
                </Avatar>
                <div>{user.username}</div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="text-right float-right">
                {user.isPremium ? (
                  <TiTick className="text-green-500" size={20} />
                ) : (
                  <ImCross className="text-red-500" />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
};

export default TeamDetails;
