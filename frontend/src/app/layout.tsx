import type { Metadata } from "next";
import { Geist, Geist_Mono, Nanum_Pen_Script, Gaegu } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nanumPen = Nanum_Pen_Script({
  weight: "400",
  variable: "--font-nanum-pen",
  subsets: ["latin"],
});

const gaegu = Gaegu({
  weight: ["400", "700"],
  variable: "--font-gaegu",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chalkboard Todo Post-its",
  description: "Manage your todos on a beautiful chalkboard post-it board.",
  icons: {
    icon: "favicon.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${nanumPen.variable} ${gaegu.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-stone-900 text-stone-100">{children}</body>
    </html>
  );
}
