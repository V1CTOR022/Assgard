import { useCallback, useState } from "react";

export type FieldErrors<K extends string> = Partial<Record<K, string>>;

export function useFieldErrors<K extends string>() {
  const [errors, setErrors] = useState<FieldErrors<K>>({});

  const clear = useCallback((field: K) => {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }, []);

  const submit = useCallback((found: FieldErrors<K>) => {
    setErrors(found);
    return Object.keys(found).length === 0;
  }, []);

  return { errors, clear, submit };
}
