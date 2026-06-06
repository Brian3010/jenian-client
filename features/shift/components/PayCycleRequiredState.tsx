import { Button } from '@/components/ui/button';
import { Card, CardAction, CardHeader } from '@/components/ui/card';

export default function PayCycleRequiredState() {
  return (
    <Card className="p-5 flex flex-col gap-3">
      <CardHeader className="grid-rows-none p-0">
        <div className="flex items-center justify-between">
          <h1 className="text-base font-semibold text-gray-900">Shift Calculator</h1>
          <span className="text-xs px-3 py-1 rounded-full font-medium bg-warning text-warning-text">
            Setup Required
          </span>
        </div>
        <div className="text-sm text-gray-500">Manage shifts and estimate your pay for the current cycle.</div>
      </CardHeader>

      <CardAction className="w-full">
        <Button className="w-full" variant="primary">
          <span className="font-semibold">Set up pay cycle</span>
        </Button>
      </CardAction>
    </Card>
  );
}
