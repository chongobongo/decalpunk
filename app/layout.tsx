import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Decal Punk",
  description: "Decals for the modern world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        {children}
      </body>
    </html>
  );
}
