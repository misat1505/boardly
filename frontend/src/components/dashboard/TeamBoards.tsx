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
import { Button, buttonVariants } from "../ui/button";
import { Board } from "@/types/Board";

type TeamBoardsProps = { team: Team; boards: Board[] };

const TeamBoards = async ({ team, boards }: TeamBoardsProps) => {
  return (
    <div>
      <div className="mb-4">
        <h2 className="font-bold text-2xl">Boards</h2>
        <p className="text-xs text-muted-foreground/50">
          View and manage your team's boards. Browse, open, filter, or create a
          new board.
        </p>
      </div>

      {boards.length > 0 ? (
        <div className="">
          <div className="grid grid-cols-4 gap-y-4">
            {boards.map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}
          </div>
          <div className="mx-auto w-fit mt-4">
            <CreateBoard />
          </div>
        </div>
      ) : (
        <NoBoards team={team} />
      )}
    </div>
  );
};

type NoBoardsProps = { team: Team };

const NoBoards = ({ team }: NoBoardsProps) => {
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <h2>
        {team.name} hasn&apos;t created any boards yet. Let&apos;s change that!
      </h2>

      <CreateBoard />
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

type CreateBoardProps = {};

const CreateBoard = ({}: CreateBoardProps) => {
  return <Button className="hover:cursor-pointer">Create New Board</Button>;
};

export default TeamBoards;
