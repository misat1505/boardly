import { getTeamBoards } from "@/actions/teams/getTeamBoards";
import { getUserTeams } from "@/actions/teams/getUserTeams";
import { getCurrentUser } from "@/actions/user/getCurrentUser";
import { Button } from "@/components/ui/button";
import { Team } from "@/types/Team";

const DashboardPage = async () => {
  const teams = await getUserTeams();
  const user = await getCurrentUser();

  return (
    <div>
      <h2>Hi, {user.givenName}</h2>
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
          <Button key={board.id}>{board.title}</Button>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
