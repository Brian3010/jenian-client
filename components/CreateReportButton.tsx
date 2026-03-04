'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Button } from './ui/button';

export default function CreateReportButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => {
        router.push('/chemist-warehouse/create-report');
      }}
    >
      Create Report
    </Button>
  );
}
