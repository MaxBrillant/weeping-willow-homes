import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomBar from "./bottomBar";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Willow Homes",
  description: "Your destination for long-term luxurious stays",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return (
    <html lang="en" className="min-h-screen flex flex-col">
      <body className={inter.className + " flex-grow"}>{children}</body>
      {session && <BottomBar />}
    </html>
  );
}
