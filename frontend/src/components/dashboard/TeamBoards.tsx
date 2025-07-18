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
import { Board } from "@/types/Board";

type TeamBoardsProps = { boards: Board[] };

const TeamBoards = async ({ boards }: TeamBoardsProps) => {
  return (
    <div>
      <div className="mb-4">
        <h2 className="font-bold text-2xl text-muted-foreground">Boards</h2>
        <p className="text-xs text-muted-foreground/50">
          View and manage your team's boards. Browse, open, filter, or create a
          new board.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-y-4">
        {boards.map((board) => (
          <BoardCard key={board.id} board={board} />
        ))}
      </div>
    </div>
  );
};

type BoardCardProps = { board: Board };

const BoardCard = ({ board }: BoardCardProps) => {
  return (
    <Link key={board.id} href={`/b/${board.id}`}>
      <Card className="w-96 border-muted-foreground/20 hover:bg-muted transition-colors">
        <CardContent>
          <Image
            src="/board.png"
            alt={board.title}
            width={350}
            height={300}
            className="bg-background rounded-sm"
          />
        </CardContent>
        <CardHeader>
          <CardTitle>{board.title}</CardTitle>
          <CardDescription className="text-xs">
            Last updated: {new Date(board.updatedAt).toLocaleDateString()}{" "}
            {new Date(board.updatedAt).toLocaleTimeString()}
          </CardDescription>
          <CardAction>
            <div className={buttonVariants({ variant: "link" })}>Open</div>
          </CardAction>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default TeamBoards;
