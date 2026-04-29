"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

type DirtyRegistry = {
  report: (id: string, isDirty: boolean) => void;
  saveTick: number;
};

const DirtyContext = createContext<DirtyRegistry | null>(null);

export function useDirtyTracking() {
  const [dirtyIds, setDirtyIds] = useState<Set<string>>(() => new Set());
  const [saveTick, setSaveTick] = useState(0);

  const report = useCallback((id: string, isDirty: boolean) => {
    setDirtyIds((prev) => {
      const has = prev.has(id);
      if (isDirty && !has) {
        const next = new Set(prev);
        next.add(id);
        return next;
      }
      if (!isDirty && has) {
        const next = new Set(prev);
        next.delete(id);
        return next;
      }
      return prev;
    });
  }, []);

  const value = useMemo<DirtyRegistry>(
    () => ({ report, saveTick }),
    [report, saveTick]
  );

  // Read latest value via a ref so Provider's identity stays stable. Otherwise
  // Provider would get a new function reference whenever value changes (e.g.
  // on save), causing React to unmount the entire subtree and lose every
  // useTrackedState value.
  const valueRef = useRef(value);
  valueRef.current = value;

  const Provider = useCallback(
    ({ children }: { children: React.ReactNode }) => (
      <DirtyContext.Provider value={valueRef.current}>{children}</DirtyContext.Provider>
    ),
    []
  );

  const isDirty = dirtyIds.size > 0;

  // Call after a successful save: every tracked field rebases its baseline
  // to its current value.
  const markSaved = useCallback(() => setSaveTick((t) => t + 1), []);

  // Call on Discard: clear dirty set; sections are expected to remount via
  // a resetKey, which re-captures fresh baselines.
  const reset = useCallback(() => setDirtyIds(new Set()), []);

  return { isDirty, Provider, markSaved, reset };
}

// Drop-in replacement for useState that compares the current value to a
// baseline and reports dirty/clean to the parent registry. The baseline is
// the value at first render; it gets refreshed when markSaved bumps saveTick.
export function useTrackedState<T>(initial: T): [T, (v: T) => void] {
  const ctx = useContext(DirtyContext);
  const id = useId();
  const baselineRef = useRef<T>(initial);
  const [value, setValue] = useState<T>(initial);

  // Rebase baseline to current value on save signal.
  const lastSeenTick = useRef(ctx?.saveTick ?? 0);
  useEffect(() => {
    if (!ctx) return;
    if (ctx.saveTick !== lastSeenTick.current) {
      lastSeenTick.current = ctx.saveTick;
      baselineRef.current = value;
      ctx.report(id, false);
    }
  }, [ctx, id, value]);

  // Cleanup: when this field unmounts, drop its dirty contribution.
  useEffect(() => {
    return () => ctx?.report(id, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = useCallback(
    (v: T) => {
      setValue(v);
      ctx?.report(id, !Object.is(v, baselineRef.current));
    },
    [ctx, id]
  );

  return [value, set];
}
