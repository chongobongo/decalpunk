// app/dashboard/page.js

import Navbar from "@/components/Navbar"

export const metadata = {
  title: "Decal-Punk",
  icons: {
    icon: { url: 'src\components\icons\icons8-star-24.png' },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

      <body>
        <Navbar />
        {children}
      </body>

  );
}
