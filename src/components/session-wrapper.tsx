"use client";

import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";

export function SessionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <RecoilRoot>{children}</RecoilRoot>
    </SessionProvider>
  );
}
