import { useEffect, useState } from "react";
import { Asset } from "expo-asset";
import { File } from "expo-file-system";

type MarkerIcons = {
  defaultUri: string;
  selectedUri: string;
};

async function toDataUri(moduleId: number): Promise<string> {
  // Load asset from bundle
  const asset = Asset.fromModule(moduleId);
  await asset.downloadAsync();

  if (!asset.localUri) {
    throw new Error("Asset failed to load (no localUri)");
  }

  // Convert to base64
  const file = new File(asset.localUri);
  const base64 = await file.base64();

  return `data:image/png;base64,${base64}`;
}

export function useMarkerIcons(): MarkerIcons | null {
  const [icons, setIcons] = useState<MarkerIcons | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [defaultUri, selectedUri] = await Promise.all([
          toDataUri(require("../../../assets/markers/shrine-default.png")),
          toDataUri(require("../../../assets/markers/shrine-selected.png")),
        ]);

        if (mounted) {
          setIcons({ defaultUri, selectedUri });
        }
      } catch (err) {
        console.log("Marker icon load failed:", err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return icons;
}