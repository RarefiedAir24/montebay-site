export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50 text-center">
      <img
        src="/logo.png"
        alt="Montebay Logo"
        className="w-40 sm:w-52 md:w-64 mb-6"
      />
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        Innovation for what’s next.
      </h1>
      <p className="text-base sm:text-lg text-gray-600 max-w-xl">
        Montebay builds streamlined digital tools, audits, and apps — quietly and purposefully.
      </p>
    </main>
  );
}
