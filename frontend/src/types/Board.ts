import { Team } from "./Team";

export type Board = {
  id: string;
  title: string;
  content: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  team: Team;
};
