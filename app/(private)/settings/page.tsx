import LogoutBtn from '@/features/auth/components/LogoutBtn';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/ui/header';

export default function SettingsPage() {
  return (
    <>
      <Header />
      <div className="w-full p-2">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Manage your account and workspace access from one place.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                More account preferences coming soon! For now, you can only log out from this page.
              </div>
              <div>
                <LogoutBtn />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
