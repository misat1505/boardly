import { Team } from "./Team";

export type Board = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  team: Team;
};
