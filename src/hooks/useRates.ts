import { useCallback, useEffect, useRef, useState } from "react";

const PAIRS = ["USD-BRL"] as const;
const RATES_URL = `https://economia.awesomeapi.com.br/json/last/${PAIRS.join(",")}`;
const TIMEOUT_MS = 10000;
const CACHE_TTL_MS = 60000;

export interface Rate {
  code: string;
  name: string;
  bid: number;
  pctChange: number;
}

class RatesApiError extends Error {}

let cache: { rates: Rate[]; fetchedAt: number } | null = null;
let inFlight: Promise<Rate[]> | null = null;

async function requestRates(): Promise<Rate[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(RATES_URL, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Assgard/1.0",
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new RatesApiError(
        res.status === 429
          ? "Limite de consultas da API atingido. Tente de novo em instantes."
          : `A API respondeu ${res.status}.`,
      );
    }

    const json = await res.json();

    const rates = PAIRS.map((pair) => {
      const entry = json?.[pair.replace("-", "")];
      if (!entry?.bid) return null;

      return {
        code: entry.code as string,
        name: String(entry.name).split("/")[0],
        bid: parseFloat(entry.bid),
        pctChange: parseFloat(entry.pctChange),
      } satisfies Rate;
    }).filter((rate): rate is Rate => rate !== null);

    if (rates.length === 0) {
      throw new RatesApiError("A API respondeu num formato inesperado.");
    }

    cache = { rates, fetchedAt: Date.now() };
    return rates;
  } finally {
    clearTimeout(timeout);
  }
}

function loadRates(force: boolean): Promise<Rate[]> {
  if (!force && cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return Promise.resolve(cache.rates);
  }
  if (!inFlight) {
    inFlight = requestRates().finally(() => {
      inFlight = null;
    });
  }
  return inFlight;
}

function describeError(error: unknown): string {
  if (error instanceof RatesApiError) return error.message;
  if (error instanceof Error && error.name === "AbortError") {
    return "A cotação demorou demais para responder.";
  }
  return "Sem conexão para buscar a cotação.";
}

export function useRates() {
  const [rates, setRates] = useState<Rate[]>(cache?.rates ?? []);
  const [loading, setLoading] = useState(cache === null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [stale, setStale] = useState(false);

  const mountedRef = useRef(true);

  const refresh = useCallback(async (force = false) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const next = await loadRates(force);
      if (!mountedRef.current) return;
      setRates(next);
      setStale(false);
    } catch (error) {
      console.warn("[useRates] falha ao buscar as cotações:", error);
      if (!mountedRef.current) return;

      if (cache) {
        setRates(cache.rates);
        setStale(true);
        return;
      }

      setErrorMessage(describeError(error));
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    refresh();

    return () => {
      mountedRef.current = false;
    };
  }, [refresh]);

  return { rates, loading, errorMessage, stale, refresh };
}
