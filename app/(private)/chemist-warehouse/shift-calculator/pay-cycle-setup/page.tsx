import { requireSession } from '@/lib/auth/session';

export default async function PayCycleSetupPage() {
  await requireSession('/chemist-warehouse/shift-calculator/pay-cycle-setup');
  return <div>PayCycleSetupPage</div>;
}
