"use client";
import { TextShimmerWave } from "@/components/ui/text-shimmer-wave";
import { Player } from "@lottiefiles/react-lottie-player";
import animationData from "./success-check.json";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const SuccessfulPaymentPage = () => {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/dashboard");
    }, 1000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col ">
      <Player
        autoplay
        loop={false}
        src={animationData}
        style={{ height: 150, width: 150 }}
        keepLastFrame
      />
      <TextShimmerWave>
        Your payment was successful. Redirecting to dashboard...
      </TextShimmerWave>
    </div>
  );
};

export default SuccessfulPaymentPage;
