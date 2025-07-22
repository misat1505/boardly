import { useWhiteboardContext } from "@/context/WhiteboardContext";
import { Button } from "./ui/button";
import { ThemeSwitch } from "./ui/theme-switch";
import {
  TourArrow,
  TourContent,
  TourFooter,
  TourOverlay,
  TourStep,
  TourTrigger,
} from "./ui/tour";
import { RiInformation2Line } from "react-icons/ri";

const UserSettings = () => {
  const { user, board } = useWhiteboardContext();

  return (
    <div className="z-10 fixed top-4 right-4 p-2 rounded-md bg-sidebar border-sidebar-border border flex space-x-1 items-center hover:cursor-auto">
      <div className="mr-4 text-right">
        <h2>{board.title}</h2>
        <p className="text-xs text-muted-foreground/50">{user.username}</p>
      </div>
      <ThemeSwitch />
      <div className="">
        <TourTrigger asChild>
          <Button variant="outline" size="icon">
            <RiInformation2Line />
          </Button>
        </TourTrigger>
        <TourOverlay />
        <TourContent className="w-96">
          <TourArrow />
          <TourStep />
          <TourFooter />
        </TourContent>
      </div>
    </div>
  );
};

export default UserSettings;
