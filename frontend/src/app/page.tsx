import { getCurrentUser } from "@/actions/user/getCurrentUser";
import Image from "next/image";

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) return <div>guest</div>;

  return (
    <div>
      <h2>{user.username}</h2>
      <Image src={user.imageUrl} alt={user.username} width={300} height={300} />
    </div>
  );
}
