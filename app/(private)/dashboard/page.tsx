'use client';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import React from 'react';

export default function Dashboard() {
  return (
    <div className="w-full p-2">
      <div className="flex flex-col gap-3">
        <h1>Hello Brian,</h1>

        <div className="flex">
          <Link href="/chemist-warehouse" className="w-full max-w-xs">
            <Card className="w-full hover:bg-gray-100 cursor-pointer">
              <CardHeader>
                <CardTitle>Chemist Warehouse</CardTitle>
                <CardDescription>Link Telegram account, generate report</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
