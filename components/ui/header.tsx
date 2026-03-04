import { SidebarTrigger } from './sidebar';

export default function Header() {
  return (
    <header className="block sticky top-0 z-20 border-b backdrop-blur border rounded-md">
      <div className="mx-auto flex items-center p-1 sm:p-2 lg:p-3">
        <SidebarTrigger className="md:hidden" />
        <span className="flex-1 text-center font-semibold italic tracking-wide underline decoration-amber-500">
          Jenian
        </span>
      </div>
    </header>
  );
}
