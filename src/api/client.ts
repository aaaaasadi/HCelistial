const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5001/api';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    if (!res.ok) {
      let errMsg = `HTTP Error ${res.status}`;
      try {
        const errJson = await res.json();
        if (errJson && errJson.error) {
          errMsg = errJson.error;
        }
      } catch {}
      throw new Error(errMsg);
    }

    const data: T = await res.json();
    return data;
  } catch (err: any) {
    console.warn(`[API Client] Request to ${endpoint} failed:`, err.message);
    throw err;
  }
}

export async function checkBackendHealth(): Promise<{
  connected: boolean;
  database: 'connected' | 'disconnected';
}> {
  try {
    const res = await apiFetch<{ status: string; database: 'connected' | 'disconnected' }>('/health');
    return {
      connected: res.status === 'ok',
      database: res.database
    };
  } catch {
    return {
      connected: false,
      database: 'disconnected'
    };
  }
}
