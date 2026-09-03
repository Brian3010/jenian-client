export class BackendWakeError extends Error {
  constructor() {
    super('Jenian could not connect to the backend service.');
    this.name = 'BackendWakeError';
  }
}

export async function wakeBackend(signal?: AbortSignal): Promise<void> {
  try {
    const response = await fetch('/api/health/wake', {
      method: 'POST',
      cache: 'no-store',
      signal,
    });

    if (!response.ok) {
      throw new BackendWakeError();
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }

    if (error instanceof BackendWakeError) {
      throw error;
    }

    throw new BackendWakeError();
  }
}
