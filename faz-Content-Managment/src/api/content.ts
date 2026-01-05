const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function fetchArticles(params = '') {
  const res = await fetch(`${API_BASE}/content${params ? `?${params}` : ''}`, { credentials: 'include' });
  return res.json();
}

export async function createArticle(payload: any) {
  const res = await fetch(`${API_BASE}/content`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
  return res.json();
}

export async function updateArticle(id: string, payload: any) {
  const res = await fetch(`${API_BASE}/content/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
  return res.json();
}

export async function deleteArticle(id: string) {
  const res = await fetch(`${API_BASE}/content/${id}`, { method: 'DELETE', credentials: 'include' });
  return res.json();
}

export async function uploadImage(file: File) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch(`${API_BASE}/content/upload`, { method: 'POST', body: fd, credentials: 'include' });
  return res.json();
}
