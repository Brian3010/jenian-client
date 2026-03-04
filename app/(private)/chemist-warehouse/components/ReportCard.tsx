'use client';
import CreateReportButton from '@/components/CreateReportButton';
import { Card, CardAction, CardHeader } from '@/components/ui/card';
import { Clipboard } from 'lucide-react';

export default function ReportCard() {
  return (
    <Card className="p-2 gap-0">
      <CardHeader className="p-2">
        <div className="flex gap-4 ">
          <span className="self-center border-2 flex size-10 items-center justify-center rounded-xl border-black">
            <Clipboard />
          </span>
          <div>
            <h1 className="self-center font-semibold text-lg">Generate end of day report</h1>
            <p className="text-sm  rounded-sm inline-block px-2 bg-green-200 text-gray-700">
              {/* {item.status.code ? item.status.description : item.status.description} */}
            </p>
          </div>
        </div>
      </CardHeader>
      {/* <CardDescription className="px-2">Input your data and geenrate a comprehensive report</CardDescription> */}
      <CardAction>
        <CreateReportButton />
      </CardAction>
    </Card>
  );
}
