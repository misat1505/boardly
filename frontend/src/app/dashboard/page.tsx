import { getTeamBoards } from "@/actions/teams/getTeamBoards";
import { getUserTeams } from "@/actions/teams/getUserTeams";
import { getCurrentUser } from "@/actions/user/getCurrentUser";
import TeamsNavigation from "@/components/dashboard/TeamsNavigation";
import { Button } from "@/components/ui/button";
import { Team } from "@/types/Team";

interface PageProps {
  searchParams: { team?: Team["id"] };
}

const DashboardPage = async ({ searchParams }: PageProps) => {
  const teams = await getUserTeams();
  const user = await getCurrentUser();

  return (
    <div className="flex w-screen min-h-screen">
      <TeamsNavigation teamId={searchParams.team} />
      <div className="flex-grow bg-background"></div>
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
