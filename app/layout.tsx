// Main Layout
// app\layout.tsx

import type { Metadata } from "next";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { CartProvider } from "@/features/cart/cartProvider";

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
    <html lang="en" className="[scrollbar-gutter:stable]">
      <body className="flex h-dvh flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  </ClerkProvider>
  );
}