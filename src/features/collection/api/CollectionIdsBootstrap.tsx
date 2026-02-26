import React, { useEffect } from "react";
import { useCollectionIdsStore } from "./collectionIds.store";
import { useAuth } from "../../../core/auth/AuthProvider";

export default function CollectionIdsBootstrap() {
  const { refresh, clear } = useCollectionIdsStore();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      // Logged out (or unauthorized) -> purge saved ids immediately
      clear();
      return;
    }

    // Logged in -> load saved ids
    refresh();
  }, [user, refresh, clear]);

  return null;
}