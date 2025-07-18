"use client";
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
import { Button, buttonVariants } from "../ui/button";
import { useState } from "react";
import { FloatingLabelInput } from "../ui/floating-label-input";

type TeamBoardsContentProps = { boards: Board[] };

const TeamBoardsContent = ({ boards }: TeamBoardsContentProps) => {
  const [text, setText] = useState("");
  console.log(boards);

  const filteredBoards = boards.filter((board) =>
    board.title.toLowerCase().includes(text.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center space-x-4">
        <h3 className="text-muted-foreground text-sm font-bold">Filter by</h3>
        <FloatingLabelInput
          label="Board Title"
          id="board-title-input"
          onChange={(e) => setText(e.target.value.trim())}
          className="w-64 dark:bg-background"
        />
      </div>
      <div className="grid grid-cols-4 gap-y-4 mt-4">
        {filteredBoards.length > 0 ? (
          filteredBoards.map((board) => (
            <BoardCard key={board.id} board={board} />
          ))
        ) : (
          <p className="text-xs text-red-500 col-span-4">
            No boards match your search.
          </p>
        )}
      </div>
      <div className="mx-auto w-fit mt-4">
        <CreateBoard team={boards[0].team}>
          <Button>Create Board</Button>
        </CreateBoard>
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
