import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

const LOGIN_BG_URL =
  "https://res.cloudinary.com/digaq48bp/image/upload/v1758636806/faz_background_ekdwhd.jpg";
const LOGO_URL =
  "https://res.cloudinary.com/digaq48bp/image/upload/v1758265423/football-association-of-zambia-logo_oe9kyd.png";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { flash?: string } | null;
    if (state?.flash) {
      toast.success(state.flash);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const API_BASE = import.meta.env.VITE_API_URL || '/api';
      const res = await fetch(`${API_BASE}/settings/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (!res || res.status < 200 || res.status >= 300) {
        const data = await res.json().catch(() => ({}));
        setError(data?.message || 'Login failed');
        return;
      }

      await sleep(200);

      const verifyRes = await fetch(`${API_BASE}/settings/admin-check-auth`, { credentials: 'include' });
      const verifyData = await verifyRes.json().catch(() => ({}));
      const admin = verifyData?.admin;

      if (verifyRes.status >= 200 && verifyRes.status < 300 && admin?._id) {
        toast.success('Login successful!');
        navigate('/dashboard', { replace: true });
      } else {
        setError(verifyData?.message || 'Session verification failed. Please try again.');
      }
    } catch (err: any) {
      console.error('❌ Login error:', err);
      const apiMsg = err?.response?.data?.message || err?.message || 'Something went wrong. Please try again.';
      setError(apiMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 -z-10 bg-center bg-cover"
        style={{ backgroundImage: `url(${LOGIN_BG_URL})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/40 to-black/70 dark:from-black/60 dark:to-black/80" />
      <div className="flex items-center justify-center min-h-screen p-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md rounded-2xl border border-border bg-card/90 backdrop-blur-md shadow-xl p-8"
        >
          <div className="flex flex-col items-center mb-6">
            <img
              src={LOGO_URL}
              alt="Football Association of Zambia"
              className="h-16 md:h-20 lg:h-24 w-auto object-contain mb-3 drop-shadow"
              loading="eager"
            />
            <h1 className="text-2xl font-semibold text-foreground text-center">FAZ CMS</h1>
            <p className="text-xs text-muted-foreground mt-1">Authorized personnel only</p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-4 rounded-md border border-red-300/40 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400"
            >
              {error}
            </div>
          )}

          <label className="mb-2 block text-sm text-muted-foreground" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="email@faz.co.zm"
            className="mb-4 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
            disabled={loading}
          />

          <label className="mb-2 block text-sm text-muted-foreground" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className="mb-6 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            disabled={loading}
          />

          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Need access? Contact <span className="font-medium">IT Support</span>.
          </p>
        </form>
      </div>
    </div>
  );
}
