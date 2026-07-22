import { Button } from '@/components/ui/button';
import { Card, CardAction, CardDescription, CardHeader } from '@/components/ui/card';
import { CalendarDays, ClipboardList, UserRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const GITHUB_URL = 'https://github.com/Brian3010';
const LINKEDIN_URL = 'https://www.linkedin.com/in/brian-nguyen-411483196/';

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.754-1.335-1.754-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.5 11.5 0 016 0c2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.352V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 110-4.124 2.062 2.062 0 010 4.124zM7.119 20.452H3.555V9H7.12v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
}

function JenianLogo({ size, className = '' }: { size: number; className?: string }) {
  return <Image src="/icon.png" alt="" width={size} height={size} className={`shrink-0 rounded-lg ${className}`} />;
}

function AppPreview() {
  const shiftSummary = [
    { label: 'Current Cycle', value: '22 July - 4 August' },
    { label: 'Shifts Worked', value: '0' },
    { label: 'Estimated Pay', value: '$0.00' },
  ];

  return (
    <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-muted/40 shadow-sm">
      <div className="flex h-12 items-center border-b border-border bg-background px-4 justify-between">
        <span className="font-semibold text-foreground">Jenian</span>
        <div className="ml-auto flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <UserRound className="size-5" aria-hidden="true" />
        </div>
      </div>

      <div className="flex flex-col gap-3 p-3 ">
        <Card className="flex flex-col gap-3">
          <CardHeader className="grid-rows-none p-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardList size={16} className="text-gray-400" aria-hidden="true" />
                <h3 className="text-base font-semibold text-gray-900">End-of-Day Report</h3>
              </div>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">Connected</span>
            </div>
          </CardHeader>
          <CardDescription>Create and send today&apos;s report</CardDescription>
          <CardAction className="flex w-full flex-1 items-end">
            <Button className="w-full" variant="primary" asChild>
              <span className="font-semibold">Generate Report</span>
            </Button>
          </CardAction>
        </Card>

        <Card className="flex flex-col gap-3 p-5">
          <CardHeader className="p-0">
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="text-gray-400" aria-hidden="true" />
              <h3 className="text-base font-semibold text-gray-900">Shift Calculator</h3>
            </div>
            <div className="text-sm text-gray-500">Manage shifts and estimate your pay for the current cycle.</div>
          </CardHeader>
          <CardDescription className="flex flex-col gap-3 border-y py-3">
            <dl className="grid grid-cols-1 gap-y-2">
              {shiftSummary.map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <dt className="text-sm text-gray-400">{item.label}</dt>
                  <dd className="text-sm text-gray-900">{item.value}</dd>
                </div>
              ))}
            </dl>
          </CardDescription>
          <CardAction className="w-full">
            <Button className="w-full" variant="primary" asChild>
              <span className="font-semibold">Open Shift Calculator</span>
            </Button>
          </CardAction>
        </Card>
      </div>
    </div>
  );
}

const techBadges = ['Next.js', 'ASP.NET Core', 'SQL Server', 'Docker', 'Azure'];

const features = [
  {
    icon: CalendarDays,
    title: 'Shift Pay Calculator',
    description:
      'Manage shifts and pay cycles, track scheduled hours, and calculate estimated gross pay using backend-controlled payroll rules.',
  },
  {
    icon: ClipboardList,
    title: 'Night Reports',
    description:
      'Create structured end-of-day reports for deliveries, stock updates, cleaning, and night-team tasks, then send the completed report to Telegram in a copy-ready format.',
  },
];

export default function Home() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Jenian home">
            <JenianLogo size={28} />
            <span className="text-sm font-semibold tracking-tight">Jenian</span>
          </Link>

          <nav className="flex items-center gap-3 sm:gap-4" aria-label="Primary navigation">
            <a
              href={GITHUB_URL}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <GitHubIcon className="size-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <Button asChild size="sm">
              <Link href="/auth/sign-in">Sign in</Link>
            </Button>
          </nav>
        </div>
      </header>
      <div className="w-full flex justify-center">
        <main>
          <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
              <div className="flex flex-col items-start gap-3 text-left">
                <h1 className="mb-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                  A practical assistant for workplace admin
                </h1>
                <p className="mb-7 max-w-md leading-relaxed text-muted-foreground text-sm">
                  Jenian helps manage shifts, estimate gross pay, and create structured end-of-day reports for recurring
                  workplace tasks.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button asChild size="lg">
                    <Link href="/auth/sign-in">Sign in</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <a href={GITHUB_URL}>
                      <GitHubIcon className="size-4" />
                      View on GitHub
                    </a>
                  </Button>
                </div>
              </div>

              <div className="flex justify-center">
                <AppPreview />
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
            <div className="pb-8">
              <h2 className="pb-1.5 text-2xl font-semibold tracking-tight">What Jenian helps with</h2>
              <p className="text-sm text-muted-foreground">Two focused tools built around real workplace tasks.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {features.map(feature => {
                const Icon = feature.icon;

                return (
                  <Card key={feature.title}>
                    <div className="flex items-center gap-3 pb-2">
                      <div className="mb-4 flex size-10 items-center justify-center rounded-lg border border-border bg-muted">
                        <Icon className="size-5 text-primary" aria-hidden="true" />
                      </div>
                      <h3 className="mb-2 text-base font-semibold">{feature.title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                  </Card>
                );
              })}
            </div>
          </section>

          <section className="border-t border-border bg-card px-4 py-10 text-center sm:px-6 flex justify-center">
            <div className="mx-auto max-w-2xl">
              <h2 className="pb-1.5 text-lg font-semibold tracking-tight">Built as a full-stack application</h2>
              <p className="pb-5 text-sm text-muted-foreground">
                Built with Next.js, ASP.NET Core, SQL Server, Docker, and Azure.
              </p>
              <ul className="flex flex-wrap justify-center gap-2" aria-label="Technologies used">
                {techBadges.map(tech => (
                  <li
                    key={tech}
                    className="inline-block text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.25"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </main>
      </div>

      <footer className="bg-card px-4 py-8 sm:px-6 border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link href="/" className="mb-2 flex w-fit items-center gap-2" aria-label="Jenian home">
              <JenianLogo size={24} />
              <span className="text-sm font-semibold">Jenian</span>
            </Link>

            <p className="text-xs text-muted-foreground">Next.js · ASP.NET Core · SQL Server · Docker · Azure</p>
          </div>

          <nav className="flex items-center gap-5" aria-label="Footer navigation">
            <Link
              href="/auth/sign-in"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
            <a
              href={GITHUB_URL}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <GitHubIcon className="size-4" />
              GitHub
            </a>
            <a
              href={LINKEDIN_URL}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <LinkedInIcon className="size-4" />
              LinkedIn
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
