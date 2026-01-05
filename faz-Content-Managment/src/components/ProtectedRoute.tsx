import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
  const [auth, setAuth] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || '/api';
        const res = await fetch(`${API_BASE}/settings/admin-check-auth`, { credentials: 'include' });
        if (cancelled) return;
        if (!res.ok) {
          setAuth(false);
          return;
        }
        const data = await res.json().catch(() => ({}));
        setAuth(Boolean(data?.admin?._id));
      } catch (err) {
        if (!cancelled) setAuth(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  if (auth === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-sm text-muted-foreground">Checking session…</div>
      </div>
    );
  }

  if (auth === false) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
