type WeekOption = {
  value: string;
  label: string;
};

export const getWorldCupWeekOptions2026 = (locale: string): WeekOption[] => {
  const startDate = new Date('2026-06-11T00:00:00');
  const endDate = new Date('2026-07-19T23:59:59');

  const fmt = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
  });

  const weeks: WeekOption[] = [];
  const current = new Date(startDate);
  let week = 1;

  while (current <= endDate) {
    const from = new Date(current);
    const to = new Date(current);
    to.setDate(to.getDate() + 6);

    if (to > endDate) {
      to.setTime(endDate.getTime());
    }

    const label = `Semana ${week} (${fmt.format(from)} - ${fmt.format(to)})`;

    weeks.push({
      value: String(week),
      label,
    });

    current.setDate(current.getDate() + 7);
    week++;
  }

  return weeks;
};
