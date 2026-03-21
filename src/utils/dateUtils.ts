export function getISOWeek(date: Date): { year: number; week: number } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return { year: d.getUTCFullYear(), week: weekNo };
}

export function getWeekId(date: Date): string {
  const { year, week } = getISOWeek(date);
  return `${year}-W${week.toString().padStart(2, '0')}`;
}

export function getCurrentWeekId(): string {
  return getWeekId(new Date());
}

export function getWeekIdFromOffset(baseWeekId: string, offset: number): string {
  const match = baseWeekId.match(/^(\d{4})-W(\d{2})$/);
  if (!match) return getCurrentWeekId();
  
  let year = parseInt(match[1], 10);
  let week = parseInt(match[2], 10);
  
  week += offset;
  
  while (week < 1) {
    year -= 1;
    week += getWeeksInYear(year);
  }
  
  while (week > getWeeksInYear(year)) {
    week -= getWeeksInYear(year);
    year += 1;
  }
  
  return `${year}-W${week.toString().padStart(2, '0')}`;
}

function getWeeksInYear(year: number): number {
  const d = new Date(year, 11, 31);
  const week = getISOWeek(d).week;
  return week === 1 ? 52 : week;
}

export function getWeekDates(weekId: string): Date[] {
  const match = weekId.match(/^(\d{4})-W(\d{2})$/);
  if (!match) return [];
  
  const year = parseInt(match[1], 10);
  const week = parseInt(match[2], 10);
  
  // Jan 4th is always in week 1
  const jan4 = new Date(year, 0, 4);
  const dayOfWeek = jan4.getDay() || 7; // 1=Mon, 7=Sun
  const week1Start = new Date(year, 0, 4 - dayOfWeek + 1);
  
  const weekStart = new Date(week1Start);
  weekStart.setDate(week1Start.getDate() + (week - 1) * 7);
  
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    dates.push(d);
  }
  return dates;
}

export function formatDateShort(date: Date): string {
  return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.`;
}
