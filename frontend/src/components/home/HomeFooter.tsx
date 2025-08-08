import Link from "next/link";

export default function HomeFooter() {
  return (
    <footer className="bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-gray-300 py-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Logo / Brand */}
        <div>
          <h3 className="text-xl font-bold text-primary">Boardly</h3>
          <p className="mt-2 text-sm">
            Collaborative whiteboards built for real-time team creativity.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-semibold mb-3">Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/features" className="hover:underline">
                Features
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:underline">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/docs" className="hover:underline">
                Documentation
              </Link>
            </li>
            <li>
              <Link href="/support" className="hover:underline">
                Support
              </Link>
            </li>
          </ul>
        </div>

        {/* Social / Contact */}
        <div>
          <h4 className="font-semibold mb-3">Connect</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="https://github.com/misat1505"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                GitHub
              </a>
            </li>
            <li>
              <a href="mailto:support@boardly.app" className="hover:underline">
                support@boardly.app
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="mt-10 text-center text-xs text-gray-500 dark:text-gray-500">
        © {new Date().getFullYear()} Boardly. All rights reserved.
      </div>
    </footer>
  );
}
