import { getCurrentUser } from "@/actions/user/getCurrentUser";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const DashboardNavbar = async () => {
  const user = await getCurrentUser();

  return (
    <nav className="w-full bg-muted/50 flex justify-between items-center p-2 border-b-1 border-b-muted-foreground/20">
      <h2 className="font-bold text-muted-foreground">Hi {user.givenName}!</h2>
      <Avatar>
        <AvatarImage src={user.imageUrl} alt={user.username} />
        <AvatarFallback>{user.username.toUpperCase()[0]}</AvatarFallback>
      </Avatar>
    </nav>
  );
};

export default DashboardNavbar;
