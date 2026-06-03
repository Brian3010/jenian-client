'use client';

import { BadgeDollarSign, LayoutDashboard, type LucideIcon, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
};

const items: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Shift Calculator',
    href: '/chemist-warehouse/shift-calculator',
    icon: BadgeDollarSign,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export default function NavBottomBar() {
  const pathname = usePathname();
  if (pathname === '/chemist-warehouse/create-report') return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-50  md:hidden">
      <nav
        className={cn(
          'mx-auto w-full max-w-5xl border border-slate-200/70',
          'bg-white/90 shadow-[0_12px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl',
        )}
      >
        <ul className="grid grid-cols-3 items-start">
          {items.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            if (item.disabled) {
              return (
                <li key={item.label} className="flex justify-center">
                  <div className="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-center text-slate-400">
                    <Icon className="h-5 w-5 stroke-2 sm:h-6 sm:w-6" />
                    <span className="text-xs font-semibold leading-none sm:text-sm">{item.label}</span>
                  </div>
                </li>
              );
            }

            return (
              <li key={item.label} className="flex justify-center border-t">
                <Link
                  href={item.href}
                  className={cn(
                    'group flex min-w-0 flex-1 flex-col items-center gap-1 p-3 text-center outline-none transition-colors',
                    isActive
                      ? 'bg-slate-100/90 text-primary border-t-primary border-t-2'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700',
                  )}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5 stroke-2 transition-colors sm:h-6 sm:w-6',
                      isActive ? 'text-primary' : 'text-slate-500 group-hover:text-slate-700',
                    )}
                  />
                  <span
                    className={cn(
                      'text-xs font-semibold leading-none transition-colors sm:text-sm',
                      isActive ? 'text-primary' : 'text-slate-500 group-hover:text-slate-700',
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
