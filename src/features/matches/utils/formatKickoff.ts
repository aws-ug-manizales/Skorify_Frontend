export const formatKickoff = (iso: string, locale: string) => {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};
