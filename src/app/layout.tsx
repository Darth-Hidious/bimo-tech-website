import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BimoTech | ESA Prime",
  description: "Advanced engineering and agentic solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
