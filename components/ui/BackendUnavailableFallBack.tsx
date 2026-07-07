export default function BackendUnavailableFallback() {
  return (
    <main role="alert" className="min-h-dvh flex flex-col items-center justify-center gap-5 p-6 text-center">
      <div className="max-w-md space-y-3">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Backend connection failed</p>

        <h1 className="text-2xl font-bold">Backend service is unavailable</h1>
      </div>
    </main>
  );
}
