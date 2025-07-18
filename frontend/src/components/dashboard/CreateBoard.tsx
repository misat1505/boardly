"use client";
import { PropsWithChildren } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { FloatingLabelInput } from "../ui/floating-label-input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Team } from "@/types/Team";
import { CreateBoardDTO } from "@/types/dto/CreateBoardDTO";
import z from "zod";
import { createBoard } from "@/actions/teams/createBoard";

type CreateBoardProps = PropsWithChildren & { team: Team };

const CreateBoard = ({ children, team }: CreateBoardProps) => {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Board</DialogTitle>
          <DialogDescription>
            Boards help organize tasks, ideas, or content within your team. Give
            your new board a name to get started.
          </DialogDescription>
        </DialogHeader>
        <CreateBoardForm team={team} />
      </DialogContent>
    </Dialog>
  );
};

type CreateBoardFormProps = { team: Team };

const FormValues = CreateBoardDTO.pick({ title: true });
type FormValues = z.infer<typeof FormValues>;

const CreateBoardForm = ({ team }: CreateBoardFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(FormValues),
  });

  const onSubmit = async (data: FormValues) => {
    const createBoardDTO: CreateBoardDTO = {
      ...data,
      content: "{}",
      teamId: team.id,
    };
    createBoard(createBoardDTO);
  };

  return (
    <form className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <FloatingLabelInput
          id="board-name"
          label="Board Name"
          className="dark:bg-background"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
        )}
      </div>
      <div className="flex justify-end">
        <Button type="submit">Create</Button>
      </div>
    </form>
  );
};

export default CreateBoard;
