export type MonthOption = { value: string; label: string };

export const getMonthOptions2026 = (locale: string): MonthOption[] => {
  const fmt = new Intl.DateTimeFormat(locale, { month: 'long' });
  return Array.from({ length: 12 }, (_, i) => {
    const month = String(i + 1).padStart(2, '0');
    const label = fmt.format(new Date(`2026-${month}-01T00:00:00`));
    return { value: month, label };
  });
};
