import z from "zod";

export const CreateBoardDTO = z.object({
  title: z.string().min(1, "Board title is required"),
  content: z.string(),
  teamId: z.string(),
});

export type CreateBoardDTO = z.infer<typeof CreateBoardDTO>;
