import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Silent AWS Audit Report",
  description: "Read-only audit report viewer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
