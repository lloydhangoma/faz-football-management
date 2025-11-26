import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthState {
  admin: any | null;
  clubData: any | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({ admin: null, clubData: null, loading: true, refresh: async () => {} });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<any | null>(null);
  const [clubData, setClubData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/clubs-panel/admin-check-auth', { credentials: 'include' });
      if (!res.ok) {
        // not authenticated
        setAdmin(null);
        setClubData(null);
        setLoading(false);
        return;
      }
      const data = await res.json();
      const a = data.admin || data;
      setAdmin(a);
      setClubData(a.club || null);
    } catch (err) {
      console.error('Auth check failed', err);
      setAdmin(null);
      setClubData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If unauthenticated and not loading, we do not auto-redirect here; consumers can react.

  return (
    <AuthContext.Provider value={{ admin, clubData, loading, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
