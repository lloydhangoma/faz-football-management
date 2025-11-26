const isProd = typeof import.meta !== 'undefined' && Boolean((import.meta as any).env?.PROD);

export const getItem = (key: string): string | null => {
  if (isProd) return null;
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
};

export const setItem = (key: string, value: string): void => {
  if (isProd) return;
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    // ignore
  }
};

export const removeItem = (key: string): void => {
  if (isProd) return;
  try {
    localStorage.removeItem(key);
  } catch (e) {
    // ignore
  }
};

export default { getItem, setItem, removeItem };
