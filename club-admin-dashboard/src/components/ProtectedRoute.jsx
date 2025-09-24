import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetch("/api/auth/check", { credentials: "include" })
      .then(res => {
        if (res.ok) setAuthenticated(true);
        else setAuthenticated(false);
      })
      .catch(() => setAuthenticated(false))
      .finally(() => setLoading(false));
  }, [location.pathname]);

  if (loading) return <div>Loading...</div>;
  if (!authenticated) return <Navigate to="/auth" replace state={{ from: location }} />;
  return children;
}
