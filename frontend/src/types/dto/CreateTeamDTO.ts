import z from "zod";

export const CreateTeamDTO = z.object({
  name: z.string().min(1, "Name is required"),
});

export type CreateTeamDTO = z.infer<typeof CreateTeamDTO>;
