import { API_CONFIG } from '../config';

export async function apiFetcher(
  endpoint: string,
  token: string | null,
  options: RequestInit = {}
): Promise<any> {
  const url = `${API_CONFIG.baseUrl}${endpoint}`;


  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) throw new Error(await res.text());

  return res.json();
}
