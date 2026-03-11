import type { Metadata } from "next";
import {
  ClerkProvider,
} from '@clerk/nextjs'

import "./globals.css";

export const metadata: Metadata = {
  title: "Decal-Punk",
  description: "Decals for dystopia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <ClerkProvider
        publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
        dynamic>
    <html lang="en">
      <body
    
      >
        {children}
      </body>
    </html>
  </ClerkProvider>
  );
}
