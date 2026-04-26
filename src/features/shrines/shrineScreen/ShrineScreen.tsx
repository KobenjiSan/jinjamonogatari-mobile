import React, {
  useMemo,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import { View, Text, StyleSheet, useWindowDimensions, Platform } from "react-native";
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
import { useUserLocation } from "../../../shared/location/useUserLocation";

type Props = {
  slug: string;
};

export default function ShrineScreen({ slug }: Props) {
  const { location: userLocation } = useUserLocation();
  const { meta, isLoading, error } = useShrineMetaApi(slug, userLocation);
  // Prefetch kami as soon as meta exists (fills cache, UI can ignore result)
  useShrineKamiApi(slug, !!meta);
  const insets = useSafeAreaInsets();

  const [containerH, setContainerH] = useState(0);
  const [headerH, setHeaderH] = useState(0);

  const { height: windowH } = useWindowDimensions();
  const screenH = Platform.OS === "web" ? windowH : containerH;

  const onContainerLayout = useCallback((e: any) => {
    setContainerH(Math.round(e.nativeEvent.layout.height));
  }, []);

  const onHeaderLayout = useCallback((e: any) => {
  setHeaderH(Math.round(e.nativeEvent.layout.height));
}, []);

  const snapPoints = useMemo(() => {
  if (screenH === 0 || headerH === 0) {
    return ["45%", "99%"];
  }

  const collapsed = Math.round(screenH - headerH);
  const expanded = Math.round(screenH);

  return [collapsed, expanded];
}, [screenH, headerH]);

  const sheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
  if (screenH && headerH) {
    sheetRef.current?.snapToIndex(0);
  }
}, [screenH, headerH]);

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

        lat: meta.lat,
        lon: meta.lon,

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

        distance_meters: meta.distance_meters,

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
        onHeaderLayout={onHeaderLayout}
      />

      <ShrineSheet
        shrine={shrine}
        userLocation={userLocation}
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
