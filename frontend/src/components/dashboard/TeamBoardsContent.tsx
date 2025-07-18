import { Board } from "@/types/Board";
import CreateBoard from "./CreateBoard";
import Link from "next/link";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import { buttonVariants } from "../ui/button";

type TeamBoardsContentProps = { boards: Board[] };

const TeamBoardsContent = ({ boards }: TeamBoardsContentProps) => {
  return (
    <div>
      <div className="grid grid-cols-4 gap-y-4">
        {boards.map((board) => (
          <BoardCard key={board.id} board={board} />
        ))}
      </div>
      <div className="mx-auto w-fit mt-4">
        <CreateBoard />
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

export default TeamBoardsContent;
