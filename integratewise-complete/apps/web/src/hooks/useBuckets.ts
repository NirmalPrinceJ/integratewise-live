'use client';

import useSWR from 'swr';
import { useCallback } from 'react';

interface BaseBucket {
  bucket_id: string;
  bucket_type: string;
  state: 'OFF' | 'ADDING' | 'SEEDED' | 'LIVE' | 'ERROR' | 'PAUSED';
  seed_method?: string;
  connected_source?: string;
  connector_status?: string;
  entity_count: number;
  last_sync_at?: string;
  next_sync_at?: string;
  sync_frequency?: string;
  error_code?: string;
  error_message?: string;
  display_name: string;
  icon: string;
  description: string;
}

interface DepartmentBucket {
  department_bucket_id: string;
  department_key: string;
  state: 'OFF' | 'ADDING' | 'SEEDED' | 'LIVE' | 'ERROR' | 'PAUSED';
  required_base_buckets: string[];
  optional_base_buckets: string[];
  unlocked_modules: string[];
  unlocked_routes: string[];
  recommended_connectors: string[];
  display_name: string;
  icon: string;
  met_requirements_count: number;
  total_requirements: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

/**
 * Hook: useBuckets
 * Fetches all base buckets for current tenant
 */
export function useBuckets() {
  const { data, error, isLoading, mutate } = useSWR<{ buckets: BaseBucket[] }>(
    '/api/buckets',
    fetcher
  );

  const addBucket = useCallback(
    async (bucketType: string, seedMethod: string, connectedSource?: string) => {
      try {
        const res = await fetch('/api/buckets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bucketType, seedMethod, connectedSource }),
        });

        if (!res.ok) throw new Error('Failed to add bucket');
        await mutate();
        return await res.json();
      } catch (error) {
        console.error('addBucket error:', error);
        throw error;
      }
    },
    [mutate]
  );

  const updateBucketState = useCallback(
    async (bucketId: string, state: string, errorCode?: string, errorMessage?: string) => {
      try {
        const res = await fetch(`/api/buckets/${bucketId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ state, errorCode, errorMessage }),
        });

        if (!res.ok) throw new Error('Failed to update bucket');
        await mutate();
        return await res.json();
      } catch (error) {
        console.error('updateBucketState error:', error);
        throw error;
      }
    },
    [mutate]
  );

  const pauseBucket = useCallback(
    async (bucketId: string) => updateBucketState(bucketId, 'PAUSED'),
    [updateBucketState]
  );

  const resumeBucket = useCallback(
    async (bucketId: string) => updateBucketState(bucketId, 'LIVE'),
    [updateBucketState]
  );

  const deleteBucket = useCallback(
    async (bucketId: string) => {
      try {
        const res = await fetch(`/api/buckets/${bucketId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete bucket');
        await mutate();
      } catch (error) {
        console.error('deleteBucket error:', error);
        throw error;
      }
    },
    [mutate]
  );

  return {
    buckets: data?.buckets || [],
    isLoading,
    error,
    addBucket,
    updateBucketState,
    pauseBucket,
    resumeBucket,
    deleteBucket,
    mutate,
  };
}

/**
 * Hook: useDepartments
 * Fetches all department buckets for current tenant
 */
export function useDepartments() {
  const { data, error, isLoading, mutate } = useSWR<{ departments: DepartmentBucket[] }>(
    '/api/departments',
    fetcher
  );

  const addDepartment = useCallback(
    async (departmentKey: string) => {
      try {
        const res = await fetch('/api/departments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ departmentKey }),
        });

        if (!res.ok) throw new Error('Failed to add department');
        await mutate();
        return await res.json();
      } catch (error) {
        console.error('addDepartment error:', error);
        throw error;
      }
    },
    [mutate]
  );

  const updateDepartmentState = useCallback(
    async (departmentKey: string, state: string) => {
      try {
        const res = await fetch(`/api/departments/${departmentKey}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ state }),
        });

        if (!res.ok) throw new Error('Failed to update department');
        await mutate();
        return await res.json();
      } catch (error) {
        console.error('updateDepartmentState error:', error);
        throw error;
      }
    },
    [mutate]
  );

  const removeDepartment = useCallback(
    async (departmentKey: string) => {
      try {
        const res = await fetch(`/api/departments/${departmentKey}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to remove department');
        await mutate();
      } catch (error) {
        console.error('removeDepartment error:', error);
        throw error;
      }
    },
    [mutate]
  );

  return {
    departments: data?.departments || [],
    isLoading,
    error,
    addDepartment,
    updateDepartmentState,
    removeDepartment,
    mutate,
  };
}
