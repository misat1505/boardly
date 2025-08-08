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
import { User } from "@/types/User";
import DashboardUserDropdown from "./DashboardUserDropdown";

const DashboardNavbar = async () => {
  const user = (await getCurrentUser()) as User;

  return (
    <>
      <nav className="bg-muted flex justify-between items-center p-2 pr-4 border-b-1 border-b-muted-foreground/20 h-13 fixed z-50 w-[calc(100vw-14rem)]">
        <h2 className="font-bold text-muted-foreground">
          Hi {user.givenName}!
        </h2>
        <div className="flex justify-center items-center gap-x-2">
          <ThemeSwitch />

          <DashboardUserDropdown user={user} />
        </div>
      </nav>
      <div className="h-13" />
    </>
  );
};

export default DashboardNavbar;
