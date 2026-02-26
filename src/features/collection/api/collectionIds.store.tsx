import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  addShrineToCollection,
  getShrineCollectionIds,
  removeShrineFromCollection,
} from "./collection.client";

type Status = "idle" | "loading" | "error";

type CollectionIdsContextValue = {
  ids: Set<number>;
  status: Status;
  error: string | null;

  // fetch from API
  refresh: () => Promise<void>;

  // update API + update local state (optimistic)
  add: (shrineId: number) => Promise<void>;
  remove: (shrineId: number) => Promise<void>;

  // convenience
  has: (shrineId: number) => boolean;
  clear: () => void;
};

const CollectionIdsContext = createContext<CollectionIdsContextValue | null>(
  null
);

export function CollectionIdsProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<Set<number>>(() => new Set());
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  // prevents late responses overwriting new state
  const reqSeq = useRef(0);

  const refresh = useCallback(async () => {
    const mySeq = ++reqSeq.current;
    setStatus("loading");
    setError(null);

    try {
      const res = await getShrineCollectionIds();
      if (mySeq !== reqSeq.current) return;

      const next = new Set<number>(
        Array.isArray(res?.shrineIds) ? res.shrineIds : []
      );

      setIds(next);
      setStatus("idle");
    } catch (e: any) {
      if (mySeq !== reqSeq.current) return;

      setStatus("error");
      setError(e?.message ?? "Failed to load saved shrine ids");
    }
  }, []);

  const clear = useCallback(() => {
    // invalidate any in-flight refresh
    reqSeq.current++;

    setIds(new Set());
    setStatus("idle");
    setError(null);
  }, []);

  const has = useCallback(
    (shrineId: number) => ids.has(shrineId),
    [ids]
  );

  const add = useCallback(async (shrineId: number) => {
    if (!Number.isFinite(shrineId)) return;

    // optimistic update
    setIds((prev) => {
      const next = new Set(prev);
      next.add(shrineId);
      return next;
    });

    try {
      await addShrineToCollection(shrineId);
    } catch (e) {
      // rollback if API fails
      setIds((prev) => {
        const next = new Set(prev);
        next.delete(shrineId);
        return next;
      });
      throw e;
    }
  }, []);

  const remove = useCallback(async (shrineId: number) => {
    if (!Number.isFinite(shrineId)) return;

    // optimistic update
    setIds((prev) => {
      const next = new Set(prev);
      next.delete(shrineId);
      return next;
    });

    try {
      await removeShrineFromCollection(shrineId);
    } catch (e) {
      // rollback if API fails
      setIds((prev) => {
        const next = new Set(prev);
        next.add(shrineId);
        return next;
      });
      throw e;
    }
  }, []);

  const value = useMemo<CollectionIdsContextValue>(
    () => ({
      ids,
      status,
      error,
      refresh,
      add,
      remove,
      has,
      clear,
    }),
    [ids, status, error, refresh, add, remove, has, clear]
  );

  return (
    <CollectionIdsContext.Provider value={value}>
      {children}
    </CollectionIdsContext.Provider>
  );
}

export function useCollectionIdsStore() {
  const ctx = useContext(CollectionIdsContext);
  if (!ctx) {
    throw new Error("useCollectionIdsStore must be used within CollectionIdsProvider");
  }
  return ctx;
}