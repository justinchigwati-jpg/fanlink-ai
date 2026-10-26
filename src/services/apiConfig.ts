import { Capacitor } from '@capacitor/core';

// Default backend deployment URL on Google Cloud Run
export const DEPLOYED_BACKEND_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'https://ais-dev-es4ivlqqankoiepviutjxp-32184360758.europe-west3.run.app';

/**
 * Returns the proper absolute or relative API URL depending on the platform:
 * - On native mobile (Capacitor Android APK), resolves to the remote deployed server
 * - On web browser, uses relative URLs which work seamlessly with the current origin
 */
export function getApiUrl(endpoint: string): string {
  const cleanPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  if (Capacitor.isNativePlatform()) {
    return `${DEPLOYED_BACKEND_URL}${cleanPath}`;
  }

  return cleanPath;
}
