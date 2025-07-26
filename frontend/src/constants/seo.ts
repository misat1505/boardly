import { Metadata } from "next";

export const DEFAULT_SEO_CONFIG: Metadata = {
  title: "Boardly – Collaborative Boards for Shared Ideas",
  description:
    "Create interactive boards and invite friends to collaborate on your shared thoughts in real-time.",
  keywords: [
    "collaboration",
    "boards",
    "teamwork",
    "shared ideas",
    "real-time",
    "online collaboration",
    "Boardly",
  ],
  authors: [{ name: "misat1505", url: "https://github.com/misat1505" }],
  openGraph: {
    title: "Boardly – Collaborative Boards for Shared Ideas",
    description:
      "Create interactive boards and invite friends to collaborate on your shared thoughts in real-time.",
    siteName: "Boardly",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Boardly – Collaborative Boards for Shared Ideas",
    description:
      "Create interactive boards and invite friends to collaborate on your shared thoughts in real-time.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
