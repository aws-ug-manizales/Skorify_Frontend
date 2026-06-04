'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@lib/api';
import { skorifyEndpoints, type SkorifyEnvelope, type TeamDto } from '@lib/api/skorify';

const TEAM_CACHE = new Map<string, TeamDto>();
const PENDING = new Map<string, Promise<TeamDto | null>>();
<<<<<<< HEAD
=======
// IDs whose fetch completed without data (team does not exist in the backend).
// Tracked so consumers can stop showing a skeleton and fall back gracefully
// instead of waiting forever.
const FAILED = new Set<string>();
>>>>>>> origin/develop

const fetchTeam = (teamId: string): Promise<TeamDto | null> => {
  const cached = TEAM_CACHE.get(teamId);
  if (cached) return Promise.resolve(cached);
  const pending = PENDING.get(teamId);
  if (pending) return pending;

  const promise = api
    .get<SkorifyEnvelope<TeamDto>>(skorifyEndpoints.team.getById, { teamId })
    .then((result) => {
      PENDING.delete(teamId);
<<<<<<< HEAD
      if (!result.success || !result.data?.data) return null;
=======
      if (!result.success || !result.data?.data) {
        FAILED.add(teamId);
        return null;
      }
      FAILED.delete(teamId);
>>>>>>> origin/develop
      TEAM_CACHE.set(teamId, result.data.data);
      return result.data.data;
    });

  PENDING.set(teamId, promise);
  return promise;
};

export type TeamsLookup = Record<string, TeamDto | undefined>;

export const useTeamsLookup = (teamIds: ReadonlyArray<string>) => {
  const [teams, setTeams] = useState<TeamsLookup>({});
<<<<<<< HEAD
=======
  const [failed, setFailed] = useState<ReadonlySet<string>>(() => new Set(FAILED));
>>>>>>> origin/develop
  const inFlight = useRef<Set<string>>(new Set());

  const resolve = useCallback(async (ids: ReadonlyArray<string>) => {
    const unique = Array.from(new Set(ids.filter(Boolean)));
    const missing = unique.filter((id) => !TEAM_CACHE.has(id) && !inFlight.current.has(id));
    missing.forEach((id) => inFlight.current.add(id));

<<<<<<< HEAD
    const fetched = await Promise.all(missing.map(fetchTeam));
    missing.forEach((id) => inFlight.current.delete(id));

    if (fetched.length === 0 && missing.length === 0) {
      // Still emit, since cached IDs may have changed since last render.
    }

=======
    await Promise.all(missing.map(fetchTeam));
    missing.forEach((id) => inFlight.current.delete(id));

>>>>>>> origin/develop
    setTeams((prev) => {
      const next: TeamsLookup = { ...prev };
      let mutated = false;
      unique.forEach((id) => {
        const cached = TEAM_CACHE.get(id);
        if (cached && next[id] !== cached) {
          next[id] = cached;
          mutated = true;
        }
      });
      return mutated ? next : prev;
    });
<<<<<<< HEAD
=======
    setFailed(new Set(FAILED));
>>>>>>> origin/develop
  }, []);

  // Trigger a refresh whenever the set of IDs changes.
  const key = teamIds.slice().sort().join('|');
  useEffect(() => {
    if (!key) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void resolve(teamIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

<<<<<<< HEAD
  return { teams, refresh: resolve };
=======
  return { teams, failed, refresh: resolve };
>>>>>>> origin/develop
};

export default useTeamsLookup;
