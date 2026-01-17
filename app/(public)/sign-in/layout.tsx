import React from 'react';

export default function layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-dvh bg-background ">
      <div className="w-full py-2 pr-2">
        <header className="block sticky top-0 z-20 border-b backdrop-blur border rounded-md">
          <div className="mx-auto flex items-center p-1 sm:p-2 lg:p-3">
            <span className="flex-1 text-center font-semibold italic tracking-wide underline decoration-amber-500">
              Jenian
            </span>
          </div>
        </header>
        <main className="py-1">
          <div className="w-full border rounded-md h-dvh flex justify-center items-center">{children}</div>
        </main>
      </div>
    </div>
  );
}
