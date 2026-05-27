import { Button } from '@/components/ui/button';
import React from 'react';

export default function BackStepButton({ handleStep, isLoading }: { handleStep: () => void; isLoading: boolean }) {
  return (
    <Button
      onClick={handleStep}
      type="button"
      disabled={isLoading}
      variant={'outline'}
      className="flex-1 py-5 rounded-xl text-sm transition active:scale-[0.99] border-gray-400"
      // className="w-full rounded-2xl bg-gray-900 py-3.5 text-sm font-medium text-white transition active:scale-[0.99]"
    >
      <span className="font-semibold">Back</span>
    </Button>
  );
}
