"use client";

import animationData from "./failure-cross.json";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import dynamic from "next/dynamic";

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);

const FailedPaymentPage = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center space-y-4">
      <Player
        autoplay
        loop={false}
        src={animationData}
        style={{ height: 150, width: 150 }}
        keepLastFrame
      />
      <h2 className="text-red-600">Payment failed. Try again later.</h2>
      <Link
        href="/dashboard"
        className={buttonVariants({
          variant: "link",
          className: "!text-white",
        })}
      >
        Go back to dashboard
      </Link>
    </div>
  );
};

export default FailedPaymentPage;
