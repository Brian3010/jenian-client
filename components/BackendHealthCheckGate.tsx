import { cookies } from 'next/headers';
import { BackendHealthWakeGate } from './BackendHealthWakeGate';

const BACKEND_READY_COOKIE = 'backendReady';

type BackendHealthCheckGateProps = {
  children: React.ReactNode;
};

export async function BackendHealthCheckGate({ children }: BackendHealthCheckGateProps) {
  const cookieStore = await cookies();
  const backendReady = cookieStore.get(BACKEND_READY_COOKIE)?.value === '1';

  if (backendReady) {
    return <>{children}</>;
  }

  return <BackendHealthWakeGate>{children}</BackendHealthWakeGate>;
}
