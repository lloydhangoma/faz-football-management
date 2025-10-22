import { useEffect, useState } from "react";
import { API } from "@/api/client";

export type Counts = {
  total: number;
  underReview: number;
  pendingDocs: number;
  approved: number;
  rejected: number;
};

export function useClubAppCounts(pollMs = 30000) {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const fetchCounts = async () => {
    try {
      const { data } = await API.get("/club-applications/_counts");
      setCounts(data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
    if (pollMs > 0) {
      const id = setInterval(fetchCounts, pollMs);
      return () => clearInterval(id);
    }
  }, [pollMs]);

  const pending = (counts?.underReview || 0) + (counts?.pendingDocs || 0);
  return { counts, pending, loading, error, refresh: fetchCounts };
}
