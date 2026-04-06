import PageTitle from "@/components/common/PageTitle";

export default function ChatPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <PageTitle
        title="Ask a By-Law Question"
        subtitle="Select a city and ask a question about its municipal by-laws."
      />

      <div className="rounded-xl border p-6">
        <p className="text-sm text-gray-600">
          Chat UI will be implemented in the next step.
        </p>
      </div>
    </main>
  );
}