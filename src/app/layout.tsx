import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getCurrentUser } from "@/lib/auth";
import { Navbar } from "@/components/ui/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "netSensei — Frontend Tutoring",
  description: "Learn frontend development with AI-powered feedback and live tutor support.",
};

export default async function RootLayout({
  children,
}: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar user={user} />
        <main className="flex-1 w-full container mx-auto px-4 py-6">
          {children}
        </main>
        <footer className="border-t border-border bg-card py-6 mt-auto">
          <p className="text-center text-sm text-muted-foreground">
            netSensei — Free frontend tutoring. No fees, no ads.
          </p>
        </footer>
      </body>
    </html>
  );