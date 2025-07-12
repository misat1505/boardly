import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("accessToken")?.value;

  console.log(accessToken);

  const user = await fetch("http://localhost:8080/auth/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => {
    if (!res.ok) redirect("/login");
    return res.json();
  });

  return (
    <div>
      <h2>{user.username}</h2>
      <Image src={user.imageUrl} alt={user.username} width={300} height={300} />
    </div>
  );
}
