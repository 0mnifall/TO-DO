import { InjectionToken } from '@angular/core';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => 'http://localhost:5299'
});

export function buildApiUrl(url: string, apiBaseUrl: string): string {
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  if (!url.startsWith('/api/')) {
    return url;
  }

  return `${apiBaseUrl.replace(/\/$/, '')}${url}`;
}
