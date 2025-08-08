"use client";
import { useTheme } from "next-themes";
import GridBackground from "../ui/grid-background";

const HeaderSection = () => {
  const { theme } = useTheme();

  return (
    <div className="h-screen">
      <GridBackground
        speed={0.5}
        squareSize={40}
        direction="diagonal"
        borderColor={theme === "dark" ? "#555" : "#aaa"}
        hoverFillColor={theme === "dark" ? "#222" : "#ccc"}
        className="h-screen"
      />
    </div>
  );
};

export default HeaderSection;
