'use client';

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';

export const LOCK_THRESHOLD_MS = 600_000; // 10 min

/**
 * Stateless predicate that mirrors the hook's `isLocked` so views can split
 * matches into open/closed groups without spinning up the timer hook per row.
 */
export const isMatchLocked = (kickOff: string, reference: Date = new Date()): boolean =>
  new Date(kickOff).getTime() - reference.getTime() <= LOCK_THRESHOLD_MS;
const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;
const MS_PER_MONTH = 30 * MS_PER_DAY; // calendar approximation

export interface MatchCountdown {
  isMounted: boolean;
  isLocked: boolean;
  msRemaining: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const subscribeNoop = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export const useMatchCountdown = (kickOff: string): MatchCountdown => {
  const isMounted = useSyncExternalStore(subscribeNoop, getClientSnapshot, getServerSnapshot);
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return useMemo(() => {
    const total = Math.max(0, new Date(kickOff).getTime() - now.getTime());
    const months = Math.floor(total / MS_PER_MONTH);
    const afterMonths = total - months * MS_PER_MONTH;
    const days = Math.floor(afterMonths / MS_PER_DAY);
    const afterDays = afterMonths - days * MS_PER_DAY;
    const hours = Math.floor(afterDays / MS_PER_HOUR);
    const afterHours = afterDays - hours * MS_PER_HOUR;
    const minutes = Math.floor(afterHours / MS_PER_MINUTE);
    const seconds = Math.floor((afterHours - minutes * MS_PER_MINUTE) / MS_PER_SECOND);

    return {
      isMounted,
      isLocked: total <= LOCK_THRESHOLD_MS,
      msRemaining: total,
      months,
      days,
      hours,
      minutes,
      seconds,
    };
  }, [kickOff, now, isMounted]);
};

export default useMatchCountdown;
