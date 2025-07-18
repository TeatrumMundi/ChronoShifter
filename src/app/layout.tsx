import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import { Lato } from "next/font/google";
import localFont from "next/font/local";
import type { Metadata } from "next";
import React from "react";
import "./globals.css";

const lato = Lato({
  weight: ["300"],
  subsets: ["latin"],
  variable: "--font-lato",
});

const verminVibes = localFont({
  src: '../../public/fonts/verminVibesWhite.otf',
  variable: "--font-verminVibes",
});

export const metadata: Metadata = {
  title: "ChronoShifter",
  description: "ChronoShifter - Your Ultimate Gaming Companion",
  icons: {
    icon: "/logo/logo.png",
    shortcut: "/logo/logo.png",
    apple: "/logo/logo.png",
  },
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className={`antialiased ${lato.variable} ${verminVibes.variable}`}>
        {children}
        <Analytics/>
        <SpeedInsights/>
      </body>
    </html>
  );
}
