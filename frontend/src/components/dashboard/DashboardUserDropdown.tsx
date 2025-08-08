import { User } from "@/types/User";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import GoPro from "./GoPro";

type DashboardUserDropdownProps = { user: User };

const DashboardUserDropdown = ({ user }: DashboardUserDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="hover:cursor-pointer">
          <Avatar>
            <AvatarImage src={user.imageUrl} alt={user.username} />
            <AvatarFallback>{user.username.toUpperCase()[0]}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-fit min-w-40">
        <h2 className="font-bold text-center px-1 pt-1">{user.username}</h2>
        <h2 className="text-xs text-center px-1 pb-1">{user.email}</h2>
        <DropdownMenuItem>Preferences</DropdownMenuItem>
        <GoPro user={user} />
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DashboardUserDropdown;
