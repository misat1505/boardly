"use client";
import { useTheme } from "next-themes";
import GridBackground from "../ui/grid-background";
import { TypewriterEffectSmooth } from "../ui/typewriter-effect";
import { TextGenerateEffect } from "../ui/text-generate-effect";
import { useEffect, useState } from "react";

const HeaderSection = () => {
  const { theme } = useTheme();

  return (
    <div className="h-screen relative">
      <GridBackground
        speed={0.5}
        squareSize={40}
        direction="diagonal"
        borderColor={theme === "dark" ? "#555" : "#aaa"}
        hoverFillColor={theme === "dark" ? "#222" : "#ccc"}
        className="h-screen"
      />
      <HeaderSectionContent />
    </div>
  );
};

const HeaderSectionContent = () => {
  const [showDescription, setShowDescription] = useState(false);

  const titleWords = [
    { text: "Think" },
    { text: "Together," },
    { text: "Build", className: "text-blue-500 dark:text-blue-500" },
    { text: "Boardly." },
  ];

  const description =
    "Brainstorm, plan, and create in real-time with your team. All in one powerful, collaborative space.";

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowDescription(true);
    }, 4 * 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center">
      <TypewriterEffectSmooth words={titleWords} />
      <div className="h-[3rem] mt-2">
        {showDescription && <TextGenerateEffect words={description} />}
      </div>
    </div>
  );
};

export default HeaderSection;
