import type { Metadata } from "next";
import { Manrope, Newsreader } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DemoNav } from "@/components/shared/DemoNav";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HopeNGO - The Living Archive",
  description: "A premium interactive web experience for HopeNGO.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <TooltipProvider>
          {children}
          <DemoNav />
        </TooltipProvider>
      </body>
    </html>
  );
}
