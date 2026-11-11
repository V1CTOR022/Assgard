import { currentDay } from "../../utils/date";
import { isOpen, type Pending } from "../../context/PendingContext";

export function isLate(item: Pending): boolean {
  return item.dueDay !== undefined && item.dueDay < currentDay();
}

export function describeDue(item: Pending): string {
  if (item.dueDay === undefined) {
    return item.monthly ? "Vence todo mês" : `Registrada em ${item.createdAt}`;
  }
  if (isLate(item)) return `Venceu dia ${item.dueDay}`;
  return item.monthly ? `Vence todo dia ${item.dueDay}` : `Vence dia ${item.dueDay}`;
}

export function splitPendings(pendings: Pending[]) {
  const open = pendings
    .filter(isOpen)
    .sort((a, b) => (a.dueDay ?? 99) - (b.dueDay ?? 99));
  const paid = pendings.filter((item) => !isOpen(item));
  const total = open.reduce((sum, item) => sum + item.amount, 0);

  return { open, paid, total };
}
