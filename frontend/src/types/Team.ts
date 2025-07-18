import { User } from "./User";

export type Team = {
  id: string;
  name: string;
  members: User[];
  isUpgraded: boolean;
};
