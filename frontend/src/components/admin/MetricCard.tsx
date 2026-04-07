type MetricCardProps = {
  label: string;
  value: number | string;
  sublabel?: string;
};

export default function MetricCard({
  label,
  value,
  sublabel,
}: MetricCardProps) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-gray-900">{value}</div>
      {sublabel ? (
        <div className="mt-1 text-xs text-gray-500">{sublabel}</div>
      ) : null}
    </div>
  );
}