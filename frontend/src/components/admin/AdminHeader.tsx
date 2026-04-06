type AdminHeaderProps = {
  title: string;
  subtitle?: string;
};

export default function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {subtitle ? <p className="mt-1 text-sm text-gray-600">{subtitle}</p> : null}
    </div>
  );
}