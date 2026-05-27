import { GradientButton } from '@/components/ui/button';
import React from 'react';

export default function NextStepButton({ handleStep }: { handleStep: () => void }) {
  return (
    <GradientButton
      onClick={handleStep}
      type="button"
      className="flex-1 flex items-center justify-center rounded-2xl text-sm font-medium text-white transition"
      // className="w-full rounded-2xl bg-gray-900 py-3.5 text-sm font-medium text-white transition active:scale-[0.99]"
    >
      <span className="font-semibold">Next</span>
    </GradientButton>
  );
}
