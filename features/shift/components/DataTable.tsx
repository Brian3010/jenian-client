export default function DataTable({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <dl className="grid grid-cols-1 gap-y-2" data-slot="data-table">
      {rows.map((row, index) => (
        <div key={index} className="flex items-center justify-between">
          <dt className="text-sm text-gray-400">{row.label}</dt>
          <dd className="text-sm text-gray-900">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
