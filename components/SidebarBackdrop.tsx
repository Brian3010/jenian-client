'use client';

import { useSidebar } from '@/components/ui/sidebar';

export function SidebarBackdrop() {
  const { open, setOpen, openMobile, setOpenMobile, isMobile } = useSidebar();

  const isOpen = isMobile ? openMobile : open;
  const close = () => (isMobile ? setOpenMobile(false) : setOpen(false));

  if (!isOpen) return null;

  return <button aria-label="Close sidebar" onClick={close} className="fixed inset-0 z-30 bg-black/40" />;
}
