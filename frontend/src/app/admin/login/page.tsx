import PageTitle from "@/components/common/PageTitle";

export default function AdminLoginPage() {
  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <PageTitle
        title="Admin Login"
        subtitle="Sign in to manage cities, documents, and processing jobs."
      />

      <div className="rounded-xl border p-6">
        <p className="text-sm text-gray-600">
          Admin login form will be implemented in the next step.
        </p>
      </div>
    </main>
  );
}