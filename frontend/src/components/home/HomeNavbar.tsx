import { getCurrentUser } from "@/actions/user/getCurrentUser";
import { ThemeSwitch } from "../ui/theme-switch";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import DashboardUserDropdown from "../dashboard/DashboardUserDropdown";
import Image from "next/image";
import { DEFAULT_SEO_CONFIG } from "@/constants/seo";

const HomeNavbar = async () => {
  const user = await getCurrentUser();

  return (
    <>
      <div className="fixed h-12 w-[calc(100vw-2rem)] z-50 top-2 left-2 bg-muted flex items-center justify-between p-2 rounded-md border border-muted-foreground">
        <div className="flex items-center space-x-2">
          <Image
            src="/boardly.png"
            alt=""
            width={32}
            height={32}
            className="rounded-sm"
          />
          <div>
            <h2 className="font-bold">Boardly</h2>
            <p className="text-xs text-accent-foreground">
              {DEFAULT_SEO_CONFIG.title as string}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="font-bold">Hi {user?.givenName ?? "Guest"}!</div>
          <ThemeSwitch />
          {!!user ? (
            <DashboardUserDropdown user={user} />
          ) : (
            <Link
              className={buttonVariants({ variant: "default" })}
              href="/login"
            >
              Create an Account
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default HomeNavbar;
