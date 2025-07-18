import { Team } from "@/types/Team";
import TeamBoards from "./TeamBoards";

type TeamDetailsProps = { team: Team };

const TeamDetails = ({ team }: TeamDetailsProps) => {
  return (
    <div className="px-4 pt-4">
      <TeamBoards team={team} />
    </div>
  );
};

export default TeamDetails;
