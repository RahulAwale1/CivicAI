type AnswerCardProps = {
  answer: string;
};

export default function AnswerCard({ answer }: AnswerCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
        Answer
      </h2>
      <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700 dark:text-gray-300">
        {answer}
      </p>
    </div>
  );
}