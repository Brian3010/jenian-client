import { Card, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardCardSkeleton() {
  return (
    <Card className="p-5 gap-0">
      <CardHeader className="grid-rows-none p-0">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>
      </CardHeader>

      <div className="mt-2 space-y-2">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-4 w-52" />
      </div>

      <div className="pt-4 w-full">
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </Card>
  );
}
