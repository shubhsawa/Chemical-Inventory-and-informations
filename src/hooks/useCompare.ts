import { useCallback, useEffect, useState } from "react";
import type { UnifiedProduct } from "../services/searchService";

const COMPARE_KEY = "ca-compare";

export function useCompare() {
  const [compareList, setCompareList] = useState<UnifiedProduct[]>(() => {
    try {
      const raw = localStorage.getItem(COMPARE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(compareList));
  }, [compareList]);

  const isInCompare = useCallback(
    (id: string) => compareList.some((c) => c.id === id),
    [compareList]
  );

  const toggleCompare = useCallback((product: UnifiedProduct) => {
    setCompareList((prev) => {
      if (prev.some((c) => c.id === product.id)) {
        return prev.filter((c) => c.id !== product.id);
      }
      if (prev.length >= 2) return [prev[1], product];
      return [...prev, product];
    });
  }, []);

  const clearCompare = useCallback(() => setCompareList([]), []);

  return { compareList, isInCompare, toggleCompare, clearCompare };
}
