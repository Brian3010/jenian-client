'use client';
import { useRouter } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';

export default function ShiftCalculatorHeader() {
  const router = useRouter();
  return (
    <div className="block sticky top-0 z-20 backdrop-blur px-5 py-2 border-b border-gray-200">
      <div className="flex justify-start items-center">
        <button className="hover:cursor-pointer w-8 h-8" onClick={() => router.replace('/dashboard')}>
          <ArrowLeft size={19} />
        </button>
        <span className=" text-gray-900">Shift Calculator</span>
      </div>
    </div>
  );
}
