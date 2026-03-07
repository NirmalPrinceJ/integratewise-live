import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Glowing Pancake — Dev Command Center",
  description: "Internal development portal for Glowing Pancake AI-Powered Knowledge Workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
