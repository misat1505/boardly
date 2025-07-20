import { Team } from "./Team";

export type Board = {
  id: string;
  title: string;
  content: string;
  previewUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  team: Team;
};
