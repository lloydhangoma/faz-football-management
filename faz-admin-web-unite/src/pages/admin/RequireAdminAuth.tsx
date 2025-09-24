// 📁 src/pages/admin/RequireAdminAuth.tsx
import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { API } from "@/api/client";

type Role =
  | "Super Admin"
  | "Manager"
  | "Moderator"
  | "Support Staff"
  | "Policy Lead"
  | "Content Editor";

const ALLOWED_ROLES: readonly Role[] = [
  "Super Admin",
  "Manager",
  "Moderator",
  "Support Staff",
  "Policy Lead",
  "Content Editor",
] as const;

interface Admin {
  _id: string;
  role: Role;
}

interface AdminCheckResponse {
  admin?: Admin | null;
}

interface RequireAdminAuthProps {
  children: ReactNode;
}

const LOGIN_PATH = "/admin/login";
// baseURL is "/api" via proxy, so don't prefix with "/api" again
const AUTH_CHECK = "/settings/admin-check-auth";

export default function RequireAdminAuth({ children }: RequireAdminAuthProps): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [adminInfo, setAdminInfo] = useState<Admin | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const checkAuth = async () => {
      try {
        const res = await API.get<AdminCheckResponse>(AUTH_CHECK, {
          withCredentials: true,
          signal: controller.signal,
        });

        if (res.status === 200 && res.data?.admin?._id) {
          setAdminInfo(res.data.admin);
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("❌ Admin auth check failed:", err);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    void checkAuth();
    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        🔐 Validating admin session...
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to={LOGIN_PATH} replace />;
  }

  if (!adminInfo || !ALLOWED_ROLES.includes(adminInfo.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl font-semibold">
        🚫 Access Denied — You do not have permission to access this section.
      </div>
    );
  }

  return <>{children}</>;
}
