import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Social App",
    default: "Social App",
  },
  description: "Social media app built with nextjs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.className} `}>
      <body className="flex min-h-full flex-col">
        <TooltipProvider>
          <main>
            {children}
            <Toaster />
          </main>
        </TooltipProvider>
      </body>
    </html>
  );
}
