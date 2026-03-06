import { useState, useEffect } from 'react';

export interface Deal {
  id: string;
  name: string;
  value?: number;
  stage?: string;
  status?: 'at_risk' | 'normal' | 'closed';
  probability?: number;
  owner?: string;
  account?: string;
  account_id?: string;
  close_date?: string;
  closeDate?: string;
  created_at?: string;
  type?: string;
  daysInStage?: number;
  nextAction?: string;
}

export type DealData = Deal;

export interface UseDealsResult {
  deals: Deal[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useDeals(filters?: Record<string, any>): UseDealsResult {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = async () => {
    setIsLoading(true);
    try {
      setDeals([]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [filters]);

  return { deals, isLoading, error, refetch };
}

export default useDeals;
