import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("accessToken")?.value;

  const teams = await fetch("http://localhost:8080/teams", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => {
    if (!res.ok) redirect("/login");
    return res.json();
  });

  return (
    <div>
      {teams.map((team: any) => (
        <div key={team.id}>{team.name}</div>
      ))}
    </div>
  );
};

export default DashboardPage;
