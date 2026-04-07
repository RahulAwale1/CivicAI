type AnswerCardProps = {
  answer: string;
};

export default function AnswerCard({ answer }: AnswerCardProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold text-gray-900">Answer</h2>
      <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
        {answer}
      </p>
    </div>
  );
}