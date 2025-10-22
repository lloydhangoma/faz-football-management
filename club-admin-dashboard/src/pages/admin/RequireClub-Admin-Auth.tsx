
// src/pages/admin/RequireClub-Admin-Auth.tsx
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";                 // ⬅️ add (for axios.isCancel)
import { API } from "@/api/client";

type ClubRole =
  | "Club Admin" | "Club Manager" | "Club Editor"
  | "Super Admin" | "Manager" | "Moderator" | "Support Staff" | "Policy Lead" | "Content Editor"
  | (string & {});
const ALLOWED_ROLES: readonly ClubRole[] = [
  "Club Admin","Club Manager","Club Editor",
  "Super Admin","Manager","Moderator","Support Staff","Policy Lead","Content Editor",
] as const;

interface ClubUser { _id: string; role?: ClubRole; clubId?: string; }
interface ClubAuthResponse { ok?: boolean; user?: ClubUser | null; admin?: ClubUser | null; }

interface Props { children: ReactNode; }

const LOGIN_PATH = "/";                    // ✅ make sure this points to your real login
const AUTH_CHECK = "/clubs-panel/admin-check-auth";

export default function RequireClubAdminAuth({ children }: Props): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [ok, setOk] = useState(false);
  const [clubUser, setClubUser] = useState<ClubUser | null>(null);

  const ran = useRef(false);               // ⬅️ prevents double fire in React Strict Mode (dev)

  useEffect(() => {
    if (ran.current) return;               // guard
    ran.current = true;

    const controller = new AbortController();

    (async () => {
      try {
        // small delay helps in dev so cookies settle after login redirects
        await new Promise((r) => setTimeout(r, 150));

        const res = await API.get<ClubAuthResponse>(AUTH_CHECK, {
          withCredentials: true,
          signal: controller.signal,
        });

        const u = (res.data?.user ?? res.data?.admin) ?? null;
        if (res.status === 200 && u?._id) {
          setClubUser(u);
          setOk(!u.role || ALLOWED_ROLES.includes(u.role));
        } else {
          setOk(false);
        }
      } catch (err: any) {
        // ✅ Ignore abort/cancelled fetches
        const canceled =
          err?.name === "CanceledError" ||
          err?.code === "ERR_CANCELED" ||
          axios.isCancel?.(err) ||
          /aborted|canceled/i.test(err?.message || "");

        if (!canceled) {
          // only log real errors
          // eslint-disable-next-line no-console
          console.error("❌ Club admin auth check failed:", err);
          setOk(false);
        }
        // if canceled, component is unmounting or effect cleaned up; no state updates needed
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      if (!controller.signal.aborted) controller.abort();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        🔐 Validating club session...
      </div>
    );
  }

  if (!ok) return <Navigate to={LOGIN_PATH} replace />;

  if (clubUser?.role && !ALLOWED_ROLES.includes(clubUser.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl font-semibold">
        🚫 Access Denied — You do not have permission to access this section.
      </div>
    );
  }

  return <>{children}</>;
}
