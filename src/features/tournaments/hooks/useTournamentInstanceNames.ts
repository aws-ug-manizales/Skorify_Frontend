'use client';

import { useEffect, useRef, useState } from 'react';
import { api } from '@lib/api';
import {
  skorifyEndpoints,
  type SkorifyEnvelope,
  type TournamentInstanceDto,
} from '@lib/api/skorify';

/**
 * Resolves human-readable names for a set of tournament-instance IDs so the UI
 * can show group names instead of raw IDs. Each instance is fetched once and
 * cached across renders; unresolved IDs simply fall back to the ID itself.
 */
export const useTournamentInstanceNames = (ids: string[]): Record<string, string> => {
  const [names, setNames] = useState<Record<string, string>>({});
  const cacheRef = useRef<Record<string, string>>({});
  const inFlightRef = useRef<Set<string>>(new Set());

  // Stable primitive dependency so the effect only re-runs when the set of IDs
  // actually changes (the `ids` array is a new reference on every render).
  const key = ids.join(',');

  useEffect(() => {
    const idList = key ? key.split(',') : [];
    const missing = idList.filter(
      (id) => id && !(id in cacheRef.current) && !inFlightRef.current.has(id),
    );
    if (missing.length === 0) return;

    missing.forEach((id) => inFlightRef.current.add(id));

    void Promise.all(
      missing.map(async (id) => {
        const result = await api.get<SkorifyEnvelope<TournamentInstanceDto>>(
          skorifyEndpoints.tournamentInstance.getById,
          { tournamentInstanceId: id },
        );
        cacheRef.current[id] = (result.success ? result.data.data?.name : undefined) ?? id;
        inFlightRef.current.delete(id);
      }),
    ).then(() => {
      setNames({ ...cacheRef.current });
    });
  }, [key]);

  return names;
};

export default useTournamentInstanceNames;
