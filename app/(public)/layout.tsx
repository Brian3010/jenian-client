import { BackendHealthCheckGate } from '@/components/BackendHealthCheckGate';

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <BackendHealthCheckGate>{children}</BackendHealthCheckGate>;
}
