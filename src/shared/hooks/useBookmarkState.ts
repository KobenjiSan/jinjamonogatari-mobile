import { useCallback, useMemo, useState } from "react";
import { useCollectionIdsStore } from "../../features/collection/api/collectionIds.store";

type BookmarkStatus = "idle" | "saving" | "error";

export function useBookmarkState(shrineId: number | null | undefined) {
  const id = shrineId == null ? NaN : Number(shrineId);

  const { has, add, remove } = useCollectionIdsStore();

  const [status, setStatus] = useState<BookmarkStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  // Derived from global store (NO API call)
  const isSaved = useMemo(() => {
    if (!Number.isFinite(id)) return null; // unknown/invalid
    return has(id);
  }, [id, has]);

  const toggle = useCallback(async () => {
    if (!Number.isFinite(id)) return;

    setStatus("saving");
    setError(null);

    try {
      if (has(id)) {
        await remove(id);
      } else {
        await add(id);
      }
      setStatus("idle");
    } catch (e: any) {
      setStatus("error");
      setError(e?.message ?? "Failed to update bookmark");
    }
  }, [id, has, add, remove]);

  const disabled = status === "saving" || !Number.isFinite(id);

  return {
    id,
    isSaved,
    status,
    error,
    disabled,
    toggle,
  };
}