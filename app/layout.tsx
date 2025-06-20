import '../styles/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className="font-sans bg-gray-50 text-gray-800">
        {children}
      </body>
    </html>
  );
}
