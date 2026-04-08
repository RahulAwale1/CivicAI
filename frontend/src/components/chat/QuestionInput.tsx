"use client";

type QuestionInputProps = {
  question: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export default function QuestionInput({
  question,
  onChange,
  onSubmit,
  loading = false,
  disabled = false,
}: QuestionInputProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Your Question
      </label>

      <textarea
        value={question}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ask a question about a city by-law..."
        rows={4}
        disabled={loading}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 disabled:opacity-70 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
      />

      <button
        onClick={onSubmit}
        disabled={disabled || loading}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Thinking..." : "Ask"}
      </button>
    </div>
  );
}