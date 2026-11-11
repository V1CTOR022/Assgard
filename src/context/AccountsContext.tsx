import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { todayLabel } from "../utils/date";

export interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: number;
}

export interface Account {
  id: string;
  name: string;
  icon: "wallet" | "piggy-bank" | "finance";
  total: number;
  transactions: Transaction[];
}

const INITIAL_ACCOUNTS: Account[] = [
  {
    id: "principal",
    name: "Conta Principal",
    icon: "wallet",
    total: 0,
    transactions: [],
  },
  {
    id: "poupanca",
    name: "Poupança",
    icon: "piggy-bank",
    total: 0,
    transactions: [],
  },
  {
    id: "investimentos",
    name: "Investimentos",
    icon: "finance",
    total: 0,
    transactions: [],
  },
];

const DEFAULT_USER_NAME = "Usuário";

const STORAGE_KEY = "@assgard/accounts";
const STORAGE_VERSION = 4;

interface StoredState {
  version: number;
  accounts: Account[];
  selectedIndex: number;
  userName?: string;
  avatarUri?: string;
}

interface AccountsValue {
  accounts: Account[];
  selectedIndex: number;
  account: Account;
  selectAccount: (index: number) => void;
  addTransaction: (amount: number, title: string) => void;
  transfer: (amount: number, destinationId: string, title: string) => void;
  userName: string;
  setUserName: (name: string) => void;
  avatarUri: string | null;
  setAvatarUri: (uri: string | null) => void;
  hydrated: boolean;
}

const AccountsContext = createContext<AccountsValue | null>(null);

export function AccountsProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [userName, setUserName] = useState(DEFAULT_USER_NAME);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw || !mountedRef.current) return;

        const stored: StoredState = JSON.parse(raw);

        if (stored?.version !== STORAGE_VERSION || !Array.isArray(stored.accounts)) {
          AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
          return;
        }

        setAccounts(stored.accounts);
        if (stored.userName) setUserName(stored.userName);
        if (stored.avatarUri) setAvatarUri(stored.avatarUri);
        setSelectedIndex(
          Math.min(Math.max(stored.selectedIndex ?? 0, 0), stored.accounts.length - 1),
        );
      })
      .catch((error) => {
        console.warn("[AccountsContext] falha ao ler o estado salvo:", error);
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

    const stored: StoredState = {
      version: STORAGE_VERSION,
      accounts,
      selectedIndex,
      userName,
      avatarUri: avatarUri ?? undefined,
    };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stored)).catch((error) => {
      console.warn("[AccountsContext] falha ao salvar o estado:", error);
    });
  }, [hydrated, accounts, selectedIndex, userName, avatarUri]);

  const addTransaction = useCallback(
    (amount: number, title: string) => {
      setAccounts((current) =>
        current.map((item, index) => {
          if (index !== selectedIndex) return item;

          return {
            ...item,
            total: item.total + amount,
            transactions: [
              { id: String(Date.now()), title, date: todayLabel(), amount },
              ...item.transactions,
            ],
          };
        }),
      );
    },
    [selectedIndex],
  );

  const transfer = useCallback(
    (amount: number, destinationId: string, title: string) => {
      setAccounts((current) => {
        const source = current[selectedIndex];
        const destination = current.find((item) => item.id === destinationId);

        if (!source || !destination || source.id === destination.id) return current;

        const date = todayLabel();
        const stamp = String(Date.now());

        return current.map((item) => {
          if (item.id === source.id) {
            return {
              ...item,
              total: item.total - amount,
              transactions: [
                {
                  id: `${stamp}-out`,
                  title: title || `Transferência para ${destination.name}`,
                  date,
                  amount: -amount,
                },
                ...item.transactions,
              ],
            };
          }

          if (item.id === destination.id) {
            return {
              ...item,
              total: item.total + amount,
              transactions: [
                {
                  id: `${stamp}-in`,
                  title: title || `Transferência de ${source.name}`,
                  date,
                  amount,
                },
                ...item.transactions,
              ],
            };
          }

          return item;
        });
      });
    },
    [selectedIndex],
  );

  const value = useMemo<AccountsValue>(
    () => ({
      accounts,
      selectedIndex,
      account: accounts[selectedIndex],
      selectAccount: setSelectedIndex,
      addTransaction,
      transfer,
      userName,
      setUserName,
      avatarUri,
      setAvatarUri,
      hydrated,
    }),
    [accounts, selectedIndex, addTransaction, transfer, userName, avatarUri, hydrated],
  );

  return <AccountsContext.Provider value={value}>{children}</AccountsContext.Provider>;
}

export function useAccounts(): AccountsValue {
  const value = useContext(AccountsContext);
  if (!value) {
    throw new Error("useAccounts precisa estar dentro de <AccountsProvider>.");
  }
  return value;
}
