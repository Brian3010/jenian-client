import React from 'react';

export default function layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen">
      <div className="mx-auto flex items-center text-2xl">
        <span className="flex-1 text-center font-semibold italic tracking-wide">Jenian</span>
      </div>
      <div className="w-full flex justify-center p-4">{children}</div>
    </div>
  );
}
