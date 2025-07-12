"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectingPage() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/");
    }, 100);

    return () => clearTimeout(timeout);
  }, [router]);

  return <p>Logging in... redirecting you to the app.</p>;
}
