export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className="font-sans text-gray-800 bg-white">{children}</body>
    </html>
  );
}