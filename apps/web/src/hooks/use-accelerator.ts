/**
 * useAccelerator — React hook for Domain Accelerator data.
 *
 * Wraps the Hydration Fabric's accelerator slots with a typed API.
 * Falls back to direct API calls if Fabric is unavailable.
 *
 * Six accelerators (v3.6 §12):
 *   1. health_score      — Account Health (CS domain)
 *   2. churn_prediction   — Churn Risk (CS domain)
 *   3. revenue_forecast   — Revenue Forecast (RevOps domain)
 *   4. pipeline_velocity  — Pipeline Velocity (Sales domain)
 *   5. nps_analysis       — NPS Analysis (cross-domain)
 *   6. data_quality       — Data Quality (cross-domain)
 *
 * Hydration slots: accelerator.{name}
 * API routes:      /api/v1/intelligence/accelerator/{slug}
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { accelerator as acceleratorApi } from '@/lib/api-client';

// ── Types ────────────────────────────────────────────────────────────────────

export type AcceleratorType =
  | 'health_score'
  | 'churn_prediction'
  | 'revenue_forecast'
  | 'pipeline_velocity'
  | 'nps_analysis'
  | 'data_quality';

export interface AcceleratorResult<T = any> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
  lastUpdated: number | null;
}

export interface HealthScoreData {
  score: number;
  trend: 'improving' | 'stable' | 'declining';
  factors: Array<{ name: string; impact: number; direction: 'positive' | 'negative' }>;
  entityId?: string;
}

export interface ChurnPredictionData {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  predictedChurnDate?: string;
  topFactors: Array<{ name: string; weight: number }>;
  confidence: number;
}

export interface RevenueForecastData {
  forecastedMrr: number;
  forecastedArr: number;
  nrr: number;
  grr: number;
  growthRate: number;
  period: string;
  confidence: number;
}

export interface PipelineVelocityData {
  avgDealCycle: number;
  winRate: number;
  avgDealSize: number;
  velocity: number;
  trend: 'accelerating' | 'stable' | 'slowing';
  stageConversion: Array<{ stage: string; rate: number }>;
}

export interface NpsAnalysisData {
  score: number;
  promoters: number;
  passives: number;
  detractors: number;
  trend: 'improving' | 'stable' | 'declining';
  themes: Array<{ topic: string; sentiment: 'positive' | 'negative'; count: number }>;
}

export interface DataQualityData {
  overallScore: number;
  completeness: number;
  accuracy: number;
  freshness: number;
  consistency: number;
  issues: Array<{ field: string; type: string; count: number; severity: 'low' | 'medium' | 'high' }>;
}

// ── API method mapping ───────────────────────────────────────────────────────

const API_MAP: Record<AcceleratorType, (params?: any) => Promise<any>> = {
  health_score: acceleratorApi.healthScore,
  churn_prediction: acceleratorApi.churnPrediction,
  revenue_forecast: acceleratorApi.revenueForecast,
  pipeline_velocity: acceleratorApi.pipelineVelocity,
  nps_analysis: acceleratorApi.npsAnalysis,
  data_quality: acceleratorApi.dataQuality,
};

// ── Fallback data (used when backend is unavailable) ─────────────────────────

const FALLBACK_DATA: Record<AcceleratorType, any> = {
  health_score: {
    score: 72,
    trend: 'stable',
    factors: [
      { name: 'Product adoption', impact: 0.85, direction: 'positive' },
      { name: 'Support tickets', impact: -0.12, direction: 'negative' },
      { name: 'Feature usage', impact: 0.65, direction: 'positive' },
    ],
  } as HealthScoreData,
  churn_prediction: {
    riskScore: 0.23,
    riskLevel: 'medium',
    topFactors: [
      { name: 'Declining logins', weight: 0.35 },
      { name: 'Support escalations', weight: 0.25 },
    ],
    confidence: 0.78,
  } as ChurnPredictionData,
  revenue_forecast: {
    forecastedMrr: 0,
    forecastedArr: 0,
    nrr: 100,
    grr: 95,
    growthRate: 0,
    period: 'current',
    confidence: 0.5,
  } as RevenueForecastData,
  pipeline_velocity: {
    avgDealCycle: 0,
    winRate: 0,
    avgDealSize: 0,
    velocity: 0,
    trend: 'stable',
    stageConversion: [],
  } as PipelineVelocityData,
  nps_analysis: {
    score: 0,
    promoters: 0,
    passives: 0,
    detractors: 0,
    trend: 'stable',
    themes: [],
  } as NpsAnalysisData,
  data_quality: {
    overallScore: 0,
    completeness: 0,
    accuracy: 0,
    freshness: 0,
    consistency: 0,
    issues: [],
  } as DataQualityData,
};

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useAccelerator<T = any>(
  type: AcceleratorType,
  params?: Record<string, any>,
): AcceleratorResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetch = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const apiFn = API_MAP[type];
      if (!apiFn) throw new Error(`Unknown accelerator: ${type}`);

      const result = await apiFn(params);

      if (!controller.signal.aborted) {
        setData((result as T) ?? (FALLBACK_DATA[type] as T));
        setLastUpdated(Date.now());
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      if (!abortRef.current?.signal.aborted) {
        console.warn(`[useAccelerator] ${type} failed, using fallback:`, err?.message);
        setError(err instanceof Error ? err : new Error(String(err)));
        // Graceful degradation → serve fallback data
        setData(FALLBACK_DATA[type] as T);
        setLastUpdated(Date.now());
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [type, JSON.stringify(params)]);

  useEffect(() => {
    fetch();
    return () => { abortRef.current?.abort(); };
  }, [fetch]);

  return { data, loading, error, refetch: fetch, lastUpdated };
}

/**
 * Convenience hooks for each accelerator — typed returns.
 */
export const useHealthScore = (params?: { entity_id?: string; domain?: string }) =>
  useAccelerator<HealthScoreData>('health_score', params);

export const useChurnPrediction = (params?: { entity_id?: string; horizon_days?: number }) =>
  useAccelerator<ChurnPredictionData>('churn_prediction', params);

export const useRevenueForecast = (params?: { period?: string; segment?: string }) =>
  useAccelerator<RevenueForecastData>('revenue_forecast', params);

export const usePipelineVelocity = (params?: { pipeline_id?: string }) =>
  useAccelerator<PipelineVelocityData>('pipeline_velocity', params);

export const useNpsAnalysis = (params?: { segment?: string; period?: string }) =>
  useAccelerator<NpsAnalysisData>('nps_analysis', params);

export const useDataQuality = (params?: { domain?: string; entity_type?: string }) =>
  useAccelerator<DataQualityData>('data_quality', params);

export default useAccelerator;
