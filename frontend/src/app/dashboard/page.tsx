import { getTeamBoards } from "@/actions/teams/getTeamBoards";
import { getUserTeams } from "@/actions/teams/getUserTeams";
import { Team } from "@/types/Team";

const DashboardPage = async () => {
  const teams = await getUserTeams();

  return (
    <div>
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  );
};

const TeamCard = async ({ team }: { team: Team }) => {
  const boards = await getTeamBoards(team.id);

  return (
    <div>
      <h2>{team.name}</h2>
      <div>
        {boards.map((board) => (
          <div key={board.id}>{board.title}</div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
