"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TextShimmerWave } from "@/components/ui/text-shimmer-wave";

export default function RedirectingPage() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/dashboard");
    }, 100);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <main className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <TextShimmerWave duration={1}>
        Just a moment... Taking you to the app.
      </TextShimmerWave>
    </main>
  );
}
