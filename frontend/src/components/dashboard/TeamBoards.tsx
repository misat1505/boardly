import { getTeamBoards } from "@/actions/teams/getTeamBoards";
import { Team } from "@/types/Team";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

type TeamBoardsProps = { team: Team };

const TeamBoards = async ({ team }: TeamBoardsProps) => {
  const boards = await getTeamBoards(team.id);

  return (
    <div className="px-4 pt-4">
      <h2 className="font-bold text-2xl mb-4 text-muted-foreground">
        Boards in {team.name}
      </h2>

      <div className="grid grid-cols-4 gap-y-4">
        {boards.map((board) => (
          <Link key={board.id} href={`/b/${board.id}`}>
            <Card className="w-96 border-muted-foreground/20 hover:bg-muted">
              <CardContent>
                <Image
                  src="/board.png"
                  alt={board.title}
                  width={350}
                  height={300}
                />
              </CardContent>
              <CardHeader>
                <CardTitle>{board.title}</CardTitle>
                <CardDescription className="text-xs">
                  Last updated: {new Date(board.updatedAt).toLocaleDateString()}{" "}
                  {new Date(board.updatedAt).toLocaleTimeString()}
                </CardDescription>
                <CardAction>
                  <div className={buttonVariants({ variant: "link" })}>
                    Open
                  </div>
                </CardAction>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TeamBoards;
