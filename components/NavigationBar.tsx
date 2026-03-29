'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NavigationBar() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();
  return (
    <div className="bottom-0 left-0 w-full bg-white border-t border-gray-200">
      <div className="max-w-xl mx-auto flex justify-around py-2">
        <button
          onClick={() => {
            setActiveTab('dashboard');
            router.replace('/dashboard');
          }}
          className={`flex flex-col items-center text-xs ${
            activeTab === 'dashboard' ? 'text-indigo-600' : 'text-gray-400'
          }`}
        >
          Home
        </button>

        <button
          onClick={() => setActiveTab('salary')}
          className={`flex flex-col items-center text-xs ${
            activeTab === 'salary' ? 'text-indigo-600' : 'text-gray-400'
          }`}
        >
          Salary
        </button>
      </div>
    </div>
  );
}
