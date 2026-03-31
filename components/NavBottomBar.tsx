'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const items = [
  {
    title: 'Dashboard',
    url: '/dashboard',
  },
  {
    title: 'Salary',
    url: '',
  },
];

export default function NavBottomBar() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const router = useRouter();

  return (
    <div className="md:hidden fixed left-0 right-0 z-50 border-t backdrop-blur" style={{ bottom: 0 }}>
      <div className="mx-auto flex justify-around py-1">
        {items.map(i => {
          const isActive = activeTab === i.title;

          return (
            <button
              key={i.title}
              onClick={() => {
                setActiveTab(i.title);
                router.replace(i.url);
              }}
              className={`flex flex-col items-center text-xs p-2 px-3 rounded-lg ${
                isActive ? 'bg-gray-100 font-semibold' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span className={`text-sm ${isActive ? 'font-semibold' : ''}`}>{i.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
// return (
//   <div
//     // className="md:hidden fixed left-0 right-0 z-50 border-t backdrop-blur pb-[max(0.5rem,env(safe-area-inset-bottom))]"
//     className="md:hidden fixed left-0 right-0 z-50 border-t backdrop-blur"
//     style={{ bottom: 0 }}
//   >
//     <div className="max-w-xl mx-auto flex justify-around py-1">
//       <button
//         onClick={() => {
//           setActiveTab('dashboard');
//           router.replace('/dashboard');
//         }}
//         className={`flex flex-col items-center text-xs p-2 px-3 rounded-lg ${
//           activeTab === 'dashboard' ? 'bg-gray-100 font-semibold' : 'text-gray-500 hover:bg-gray-50'
//         }`}
//       >
//         <span className={`${activeTab === 'dashboard' && 'font-semibold'}`}>Home</span>
//       </button>

//       <button
//         onClick={() => setActiveTab('salary')}
//         className={`flex flex-col items-center text-xs p-2 rounded-lg ${
//           activeTab === 'salary' ? 'bg-gray-100 font-medium' : 'text-gray-500 hover:bg-gray-50'
//         }`}
//       >
//         <span className={`${activeTab === 'salary' && 'font-semibold'}`}>Salary</span>
//       </button>
//     </div>
//   </div>
// );
