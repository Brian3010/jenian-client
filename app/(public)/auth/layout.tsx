import React from 'react';

export default function layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="w-full min-h-screen">
      <div className="w-full flex justify-center p-4">{children}</div>
    </div>
  );
}
