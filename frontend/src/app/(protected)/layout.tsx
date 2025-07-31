import { getCurrentUser } from "@/actions/user/getCurrentUser";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

type ProtectedLayoutProps = PropsWithChildren;

const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return children;
};

export default ProtectedLayout;
