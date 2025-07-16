import { getUserTeams } from "@/actions/teams/getUserTeams";

const DashboardPage = async () => {
  const teams = await getUserTeams();

  return (
    <div>
      {teams.map((team) => (
        <div key={team.id}>{team.name}</div>
      ))}
    </div>
  );
};

export default DashboardPage;
