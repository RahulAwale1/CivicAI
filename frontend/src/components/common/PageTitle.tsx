type PageTitleProps = {
  title: string;
  subtitle?: string;
};

export default function PageTitle({ title, subtitle }: PageTitleProps) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}