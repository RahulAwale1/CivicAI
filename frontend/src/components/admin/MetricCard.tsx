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
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
        {value}
      </div>
      {sublabel ? (
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {sublabel}
        </div>
      ) : null}
    </div>
  );
}