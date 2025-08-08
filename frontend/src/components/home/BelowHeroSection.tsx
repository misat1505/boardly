import { User } from "@/types/User";
import { buttonVariants } from "../ui/button";
import Link from "next/link";

const featureCards = [
  {
    icon: "🧩",
    title: "Drag-and-Drop Boards",
    desc: "Easily move elements around a limitless canvas.",
  },
  {
    icon: "🔄",
    title: "Real-Time Sync",
    desc: "See edits live with no refresh — always up to date.",
  },
  {
    icon: "👥",
    title: "Team Permissions",
    desc: "Control who can view, edit, or manage your boards.",
  },
];

const steps = [
  {
    step: "1",
    title: "Create a Team",
    desc: "Set up a team space and invite collaborators with just an email.",
  },
  {
    step: "2",
    title: "Start a Board",
    desc: "Choose from templates or start fresh. Use sticky notes, shapes, and more.",
  },
  {
    step: "3",
    title: "Collaborate Live",
    desc: "Everyone sees updates in real-time — no need to refresh or sync.",
  },
];

type BelowHeroSectionProps = { user: User | null };

export default function BelowHeroSection({ user }: BelowHeroSectionProps) {
  return (
    <>
      {/* Feature Highlights */}
      <section className="py-20 bg-gray-50 dark:bg-zinc-900">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-10">
            Powerful Features Built for Teams
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featureCards.map(({ icon, title, desc }, i) => (
              <div
                key={i}
                className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow hover:shadow-lg transition"
              >
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white dark:bg-zinc-950">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {steps.map(({ step, title, desc }, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold mb-2">
                  {step}
                </div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">
            Start Collaborating Visually — Today
          </h2>
          <p className="mb-6 text-lg">
            Create your first team and board for free. Upgrade anytime.
          </p>
          <Link
            className={buttonVariants({ variant: "secondary" })}
            href={!!user ? "/dashboard" : "/login"}
          >
            Start Collaborating
          </Link>
        </div>
      </section>
    </>
  );
}
