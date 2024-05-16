import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@/app/globals.css";

import { Sidebar } from "@/components/sidebar";
import { News } from "@/components/news";
import { SessionWrapper } from "@/components/session-wrapper";
import { CommentModal } from "@/components/comment-modal";

export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "X Clone",
  description: "X website clone with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
      <html lang="en">
        <body className={inter.className}>
          <div className="flex justify-between max-w-6xl mx-auto">
            <div className="hidden sm:inline border-r h-screen sticky top-0">
              <Sidebar />
            </div>
            <div className="flex-1">{children}</div>
            <div className="lg:flex lg:flex-col p-3 h-screen border-l hidden w-[24rem]">
              <div className="sticky top-0 bg-white py-2">
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-gray-100 border border-gray-200 rounded-3xl text-sm w-full px-4 py-2"
                />
              </div>
              <News />
            </div>
          </div>
          <CommentModal />
        </body>
      </html>
    </SessionWrapper>
  );
}
