export default function BackendUnavailableFallBack() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-2xl font-bold">Service temporarily unavailable</h1>
      <p className="text-center">Server is currently unreachable. Please try again later.</p>
    </main>
  );
}
