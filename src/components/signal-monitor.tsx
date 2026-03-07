'use client';

import { useEffect, useState } from 'react';

type SignalItem = {
  signal_id: string;
  spine_id: string;
  type: string;
  confidence: number;
  timestamp: string;
};

export function SignalMonitor() {
  const [signals, setSignals] = useState<SignalItem[]>([]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('https://gateway.integratewise.online/metrics/signals');
        if (!res.ok) return;
        const data = await res.json() as { recent_signals?: SignalItem[] };
        setSignals(data.recent_signals || []);
      } catch {
        // Intentionally ignore polling failures; next tick retries.
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid gap-2">
      {signals.map((s) => (
        <div key={s.signal_id} className="p-4 border rounded">
          <div className="flex justify-between">
            <span>{s.spine_id}</span>
            <span className={s.confidence > 0.8 ? 'text-green-500' : 'text-yellow-500'}>
              {(s.confidence * 100).toFixed(0)}%
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {s.type} • {s.timestamp}
          </div>
        </div>
      ))}
    </div>
  );
}
