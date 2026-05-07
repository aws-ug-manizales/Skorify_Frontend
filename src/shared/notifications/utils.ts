type TranslateFn = (key: string, values?: Record<string, string | number>) => string;

export const resolveNotificationText = (
  t: TranslateFn,
  key?: string,
  raw?: string,
  values?: Record<string, string | number>,
): string => {
  if (raw) return raw;
  if (key) return t(key, values);
  return '';
};
