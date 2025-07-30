import { getCurrentUser } from "@/actions/user/getCurrentUser";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ThemeSwitch } from "../ui/theme-switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import GoPro from "./GoPro";

const DashboardNavbar = async () => {
  const user = await getCurrentUser();

  return (
    <>
      <nav className="bg-muted flex justify-between items-center p-2 pr-4 border-b-1 border-b-muted-foreground/20 h-13 fixed z-50 w-[calc(100vw-14rem)]">
        <h2 className="font-bold text-muted-foreground">
          Hi {user.givenName}!
        </h2>
        <div className="flex justify-center items-center gap-x-2">
          <ThemeSwitch />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="hover:cursor-pointer"
              >
                <Avatar>
                  <AvatarImage src={user.imageUrl} alt={user.username} />
                  <AvatarFallback>
                    {user.username.toUpperCase()[0]}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-fit min-w-40">
              <h2 className="font-bold text-center px-1 pt-1">
                {user.username}
              </h2>
              <h2 className="text-xs text-center px-1 pb-1">{user.email}</h2>
              <DropdownMenuItem>Preferences</DropdownMenuItem>
              <GoPro user={user} />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
      <div className="h-13" />
    </>
  );
};

export default DashboardNavbar;
