const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export function dayLabel(date: Date = new Date()): string {
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

export function todayLabel(): string {
  return dayLabel();
}

export function yesterdayLabel(): string {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return dayLabel(date);
}

const MONTH_NAMES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

export function monthKey(date: Date = new Date()): string {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

export function monthName(date: Date = new Date()): string {
  return MONTH_NAMES[date.getMonth()];
}

export function nextMonthName(date: Date = new Date()): string {
  return MONTH_NAMES[(date.getMonth() + 1) % 12];
}

export function currentDay(date: Date = new Date()): number {
  return date.getDate();
}
