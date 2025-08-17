import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const LoginPage = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6 text-center border border-muted-foreground/30 rounded-2xl p-6 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome</h1>
          <p className="text-sm text-muted-foreground">
            Sign in with Google to continue
          </p>
        </div>
        <Link
          href={`${process.env.NEXT_PUBLIC_LOGIN_REDIRECT}/oauth2/authorization/google`}
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "w-full flex items-center justify-center gap-2"
          )}
        >
          <Image src="/google.svg" alt="Google Logo" width={18} height={18} />
          <span className="text-sm font-medium">Sign in with Google</span>
        </Link>
      </div>
    </main>
  );
};

export default LoginPage;
