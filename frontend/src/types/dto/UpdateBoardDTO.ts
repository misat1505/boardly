import z from "zod";

export const UpdateBoardDTO = z.object({
  content: z.string(),
  title: z.string(),
  previewUrl: z.string(),
});

export type UpdateBoardDTO = z.infer<typeof UpdateBoardDTO>;
