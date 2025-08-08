import Image from "next/image";

const cardData = [
  {
    title: "Create & Join Teams",
    description:
      "Start a new team or join an existing one to brainstorm, plan, and collaborate visually in real time.",
    image: "/home/live-collaboration.svg",
  },
  {
    title: "Upgrade with Stripe",
    description:
      "Securely upgrade to premium using Stripe. Enjoy instant access to advanced collaboration tools for yourself or your team.",
    image: "/home/stripe-payments.svg",
  },
  {
    title: "Designed for Day and Night",
    description:
      "Whether you're working late or presenting in daylight, Boardly adapts with built-in dark mode for visual comfort and focus.",
    image: "/home/dark-mode-support.svg",
  },
];

export default function HeroSection() {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">
          Collaborate Better with Boardly
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Organize your team, upgrade your workspace, and create boards that
          bring your ideas to life.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="bg-white dark:bg-zinc-900 shadow-lg rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-xl transition"
          >
            <div className="w-20 h-20 mb-4 relative">
              <Image
                src={card.image}
                alt={card.title}
                layout="fill"
                objectFit="contain"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
