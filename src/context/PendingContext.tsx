import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { monthKey, todayLabel } from "../utils/date";
import { cancelReminder, scheduleMonthlyReminder } from "../services/notifications";

export interface Pending {
  id: string;
  title: string;
  amount: number;
  createdAt: string;
  monthly: boolean;
  dueDay?: number;
  notificationId?: string;
  lastPaidMonth?: string;
  paid: boolean;
}

const STORAGE_KEY = "@assgard/pendings";
const STORAGE_VERSION = 1;

interface StoredState {
  version: number;
  pendings: Pending[];
}

interface PendingValue {
  pendings: Pending[];
  addPending: (title: string, amount: number, monthly: boolean, dueDay?: number) => void;
  markPaid: (id: string) => void;
  removePending: (id: string) => void;
}

export function isOpen(item: Pending): boolean {
  return item.monthly ? item.lastPaidMonth !== monthKey() : !item.paid;
}

const PendingContext = createContext<PendingValue | null>(null);

export function PendingProvider({ children }: { children: React.ReactNode }) {
  const [pendings, setPendings] = useState<Pending[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw || !mountedRef.current) return;

        const stored: StoredState = JSON.parse(raw);
        if (stored?.version !== STORAGE_VERSION || !Array.isArray(stored.pendings)) {
          AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
          return;
        }

        setPendings(stored.pendings);
      })
      .catch((error) => {
        console.warn("[PendingContext] falha ao ler o estado salvo:", error);
      })
      .finally(() => {
        if (mountedRef.current) setHydrated(true);
      });

    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const stored: StoredState = { version: STORAGE_VERSION, pendings };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stored)).catch((error) => {
      console.warn("[PendingContext] falha ao salvar o estado:", error);
    });
  }, [hydrated, pendings]);

  const addPending = useCallback(
    (title: string, amount: number, monthly: boolean, dueDay?: number) => {
      const id = String(Date.now());

      setPendings((current) => [
        { id, title, amount, createdAt: todayLabel(), monthly, dueDay, paid: false },
        ...current,
      ]);

      if (!monthly || dueDay === undefined) return;

      scheduleMonthlyReminder(title, amount, dueDay)
        .then((notificationId) => {
          if (!notificationId || !mountedRef.current) return;
          setPendings((current) =>
            current.map((item) => (item.id === id ? { ...item, notificationId } : item)),
          );
        })
        .catch((error) => {
          console.warn("[PendingContext] falha ao agendar o alarme:", error);
        });
    },
    [],
  );

  const markPaid = useCallback((id: string) => {
    setPendings((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        return item.monthly
          ? { ...item, lastPaidMonth: monthKey() }
          : { ...item, paid: true };
      }),
    );
  }, []);

  const removePending = useCallback((id: string) => {
    setPendings((current) => {
      const alvo = current.find((item) => item.id === id);
      if (alvo?.notificationId) cancelReminder(alvo.notificationId);

      return current.filter((item) => item.id !== id);
    });
  }, []);

  const value = useMemo<PendingValue>(
    () => ({ pendings, addPending, markPaid, removePending }),
    [pendings, addPending, markPaid, removePending],
  );

  return <PendingContext.Provider value={value}>{children}</PendingContext.Provider>;
}

export function usePendings(): PendingValue {
  const value = useContext(PendingContext);
  if (!value) {
    throw new Error("usePendings precisa estar dentro de <PendingProvider>.");
  }
  return value;
}
