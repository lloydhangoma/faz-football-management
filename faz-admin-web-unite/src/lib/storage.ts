// Dev-safe storage wrapper: no-ops in production
export function getItem(key: string): string | null {
  try {
    if (import.meta.env && import.meta.env.PROD) return null;
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

export function setItem(key: string, value: string) {
  try {
    if (import.meta.env && import.meta.env.PROD) return;
    localStorage.setItem(key, value);
  } catch (e) {}
}

export function removeItem(key: string) {
  try {
    if (import.meta.env && import.meta.env.PROD) return;
    localStorage.removeItem(key);
  } catch (e) {}
}
