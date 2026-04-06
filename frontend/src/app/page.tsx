import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold">CivicAI</h1>
      <p className="mt-4 max-w-2xl text-gray-600">
        AI-powered municipal by-law assistant for city-specific document search
        and grounded question answering.
      </p>

      <div className="mt-8 flex gap-4">
        <Link
          href="/chat"
          className="rounded-lg bg-blue-600 px-5 py-3 text-white"
        >
          Start Asking
        </Link>
        <Link
          href="/admin/login"
          className="rounded-lg border px-5 py-3"
        >
          Admin Login
        </Link>
      </div>
    </main>
  );
}