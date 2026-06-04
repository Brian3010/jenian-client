export default function DataTableSkeleton() {
  return (
    <dl className="grid grid-cols-1 gap-y-2 animate-pulse" data-slot="data-table-skeleton">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between">
          <dt className="h-4 w-24 rounded bg-gray-200" />
          <dd className="h-4 w-32 rounded bg-gray-200" />
        </div>
      ))}
    </dl>
  );
}
