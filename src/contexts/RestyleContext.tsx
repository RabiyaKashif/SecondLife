import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { restyleIdeas as bundledIdeas } from '../data/ideas';
import { fetchRestyleIdeas } from '../utils/airtable';
import { composeSummary, topMatches } from '../utils/matching';
import type { RestyleIdea, RestyleRequest, ScoredIdea } from '../types/restyle';

const emptyRequest: RestyleRequest = {
  photoDataUrl: null,
  garment_type: '',
  dominant_color: '',
  fabric_type: [],
  original_style_tags: [],
  wish: ''
};

interface RestyleContextValue {
  request: RestyleRequest;
  updateRequest: (patch: Partial<RestyleRequest>) => void;
  resetRequest: () => void;
  matches: ScoredIdea[];
  summary: string;
  summaryLoading: boolean;
  runMatching: () => Promise<void>;
}

const RestyleContext = createContext<RestyleContextValue | null>(null);

export function RestyleProvider({ children }: { children: React.ReactNode }) {
  const [request, setRequest] = useState<RestyleRequest>(emptyRequest);
  const [matches, setMatches] = useState<ScoredIdea[]>([]);
  const [summary, setSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  // Starts with bundled sample data so the app is never empty while the
  // real Airtable data loads (or if it fails to load).
  const [ideas, setIdeas] = useState<RestyleIdea[]>(bundledIdeas);

  useEffect(() => {
    let cancelled = false;
    fetchRestyleIdeas().then((liveIdeas) => {
      if (!cancelled) setIdeas(liveIdeas);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const updateRequest = useCallback((patch: Partial<RestyleRequest>) => {
    setRequest((current) => ({ ...current, ...patch }));
  }, []);

  const resetRequest = useCallback(() => {
    setRequest(emptyRequest);
    setMatches([]);
    setSummary('');
  }, []);

  const runMatching = useCallback(async () => {
    setSummary('');
    setSummaryLoading(true);
    // Matching against the curated table is instant and never blocked by the
    // AI summary call, which resolves separately.
    const results = topMatches(ideas, request, 4);
    setMatches(results);

    // Try the real AI-generated summary first. If it fails for any reason
    // (rate limit, network issue, key missing), fall back to the free
    // keyword-based composeSummary() so the app never breaks or looks empty.
    try {
      const response = await fetch('/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          garment_type: request.garment_type,
          dominant_color: request.dominant_color,
          fabric_type: request.fabric_type,
          wish: request.wish,
          topMatches: results.map((r) => r.idea),
        }),
      });

      if (!response.ok) throw new Error('AI summary request failed');

      const data = await response.json();
      if (!data.summary) throw new Error('AI summary was empty');

      setSummary(data.summary);
    } catch (error) {
      console.warn('Falling back to local summary:', error);
      setSummary(composeSummary(request, results));
    }

    setSummaryLoading(false);
  }, [request, ideas]);

  const value = useMemo(
    () => ({ request, updateRequest, resetRequest, matches, summary, summaryLoading, runMatching }),
    [request, updateRequest, resetRequest, matches, summary, summaryLoading, runMatching]
  );

  return <RestyleContext.Provider value={value}>{children}</RestyleContext.Provider>;
}

export function useRestyle(): RestyleContextValue {
  const context = useContext(RestyleContext);
  if (!context) throw new Error('useRestyle must be used inside RestyleProvider');
  return context;
}
