import React, {
  useMemo,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import { View, Text, StyleSheet } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useShrineMetaApi } from "./tabs/meta/api/useShrineMeta";
import { useShrineKamiApi } from "./tabs/kami/api/useShrineKami";
import { useShrineHistoryApi } from "./tabs/history/api/useShrineHistory";
import { useShrineFolkloreApi } from "./tabs/folklore/api/useShrineFolklore";
import ShrineHeader from "./tabs/meta/ShrineHeader";
import ShrineSheet, { Tab } from "./bottomSheet/ShrineSheet";
import { g } from "../../../shared/styles/global";
import { colors } from "../../../shared/styles/tokens";
import { useShrineGalleryApi } from "./tabs/gallery/api/gallery/useShrineGallery";

type Props = {
  slug: string;
};

export default function ShrineScreen({ slug }: Props) {
  const { meta, isLoading, error } = useShrineMetaApi(slug);
  // Prefetch kami as soon as meta exists (fills cache, UI can ignore result)
  useShrineKamiApi(slug, !!meta);
  const insets = useSafeAreaInsets();

  const [containerH, setContainerH] = useState(0);
  const [heroH, setHeroH] = useState(0);
  const [introH, setIntroH] = useState(0);

  const onContainerLayout = useCallback((e: any) => {
    setContainerH(Math.round(e.nativeEvent.layout.height));
  }, []);

  const onHeroLayout = useCallback((e: any) => {
    setHeroH(Math.round(e.nativeEvent.layout.height));
  }, []);

  const onIntroLayout = useCallback((e: any) => {
    setIntroH(Math.round(e.nativeEvent.layout.height));
  }, []);

  const snapPoints = useMemo(() => {
    if (containerH === 0 || heroH === 0 || introH === 0) return ["45%", "99%"];

    const aboveH = insets.top + 8 + heroH + introH;
    let collapsed = Math.round(containerH - aboveH);

    collapsed = Math.max(
      120,
      Math.min(collapsed, Math.round(containerH * 0.85)),
    );

    const expanded = Math.round(containerH * 0.99);
    return [collapsed, expanded];
  }, [containerH, heroH, introH, insets.top]);

  const sheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (containerH && heroH && introH) {
      sheetRef.current?.snapToIndex(0);
    }
  }, [containerH, heroH, introH]);

  const [activeTab, setActiveTab] = useState<Tab>("Info");
  const [openedKamiOnce, setOpenedKamiOnce] = useState(false);
  const [openedHistoryOnce, setOpenedHistoryOnce] = useState(false);
  const [openedFolkloreOnce, setOpenedFolkloreOnce] = useState(false);

  useEffect(() => {
    if (activeTab === "Kami" && !openedKamiOnce) {
      setOpenedKamiOnce(true);
    }

    if (activeTab === "History" && !openedHistoryOnce) {
      setOpenedHistoryOnce(true);
    }

    // NEW
    if (activeTab === "Folklore" && !openedFolkloreOnce) {
      setOpenedFolkloreOnce(true);
    }
  }, [activeTab, openedKamiOnce, openedHistoryOnce, openedFolkloreOnce]);

  // prefetch
  useShrineHistoryApi(slug, !!meta && openedKamiOnce);
  useShrineFolkloreApi(slug, !!meta && openedHistoryOnce);
  useShrineGalleryApi(slug, openedFolkloreOnce);

  if (isLoading) {
    return (
      <View style={[g.fill, g.center]}>
        <Text>Loading shrine...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[g.fill, g.center]}>
        <Text>{error}</Text>
      </View>
    );
  }

  const shrine = meta
    ? {
        // Header needs these
        shrine_id: meta.shrine_id,
        slug: meta.slug,
        name_en: meta.name_en,
        name_jp: meta.name_jp,
        imageUrl: meta.imageUrl,
        tags: meta.tags,

        // Info tab needs these
        shrine_desc: meta.shrine_desc,
        phone_number: meta.phone_number,
        email: meta.email,
        website: meta.website,

        // Your InfoTab currently expects these flat address fields:
        address_raw: meta.address?.address_raw ?? null,
        prefecture: meta.address?.prefecture ?? null,
        city: meta.address?.city ?? null,
        ward: meta.address?.ward ?? null,
        locality: meta.address?.locality ?? null,
        postal_code: meta.address?.postal_code ?? null,
        country: meta.address?.country ?? null,

        // Distance calc needs lat/lon — not in meta DTO, so null for now
        lat: null,
        lon: null,

        // Other tabs not wired yet
        kami: [],
        history: [],
        folklore: [],
        gallery: [],
      }
    : null;

  if (!meta || !shrine) {
    return (
      <View style={[g.fill, g.center]}>
        <Text>Shrine not found: {slug}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} onLayout={onContainerLayout}>
      <ShrineHeader
        shrine={shrine}
        insetsTop={insets.top}
        onHeroLayout={onHeroLayout}
        onIntroLayout={onIntroLayout}
      />

      <ShrineSheet
        shrine={shrine}
        sheetRef={sheetRef}
        snapPoints={snapPoints}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
});
