import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import ShrineTabBar from "./ShrineTabBar";

import ShrineInfoTab from "../tabs/meta/ShrineInfoTab";
import ShrineKamiTab from "../tabs/kami/ShrineKamiTab";
import ShrineHistoryTab from "../tabs/history/ShrineHistoryTab";
import ShrineFolkloreTab from "../tabs/folklore/ShrineFolkloreTab";
import ShrineGalleryTab from "../tabs/gallery/ShrineGalleryTab";

import type { ShrineDetailModel } from "../mappers/shrine.mappers";
import { colors, spacing, radius } from "../../../../shared/styles/tokens";

import type { LatLon } from "../../../../shared/location/distance";

const TABS = ["Info", "Kami", "History", "Folklore", "Gallery"] as const;
export type Tab = (typeof TABS)[number];

type Props = {
  shrine: ShrineDetailModel;
  userLocation: LatLon | null;
  sheetRef: React.RefObject<BottomSheet | null>;
  snapPoints: (string | number)[];
  activeTab: Tab;
  onChangeTab: (t: Tab) => void;
};

function clampIndex(i: number) {
  if (i < 0) return 0;
  if (i >= TABS.length) return TABS.length - 1;
  return i;
}

export default function ShrineSheet({
  shrine,
  userLocation,
  sheetRef,
  snapPoints,
  activeTab,
  onChangeTab,
}: Props) {
  const activeIndex = TABS.indexOf(activeTab);

  function goPrev() {
    const nextIdx = clampIndex(activeIndex - 1);
    if (nextIdx !== activeIndex) onChangeTab(TABS[nextIdx]);
  }

  function goNext() {
    const nextIdx = clampIndex(activeIndex + 1);
    if (nextIdx !== activeIndex) onChangeTab(TABS[nextIdx]);
  }

  return (
    <BottomSheet
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
    >
      {/* Wrap scroll + overlay so edges can sit above content */}
      <View style={styles.wrapper}>
        <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
          <ShrineTabBar
            tabs={TABS}
            activeTab={activeTab}
            onChange={onChangeTab}
          />

          {activeTab === "Info" && <ShrineInfoTab shrine={shrine} origin={userLocation} />}
          {activeTab === "Kami" && (
            <ShrineKamiTab
              slug={shrine.slug}
              enabled={activeTab === "Kami"}
            />
          )}
          {activeTab === "History" && (
            <ShrineHistoryTab slug={shrine.slug} enabled={activeTab === "History"} />
          )}
          {activeTab === "Folklore" && (
            <ShrineFolkloreTab slug={shrine.slug} enabled={activeTab === "Folklore"} />
          )}
          {activeTab === "Gallery" && (
            <ShrineGalleryTab
              slug={shrine.slug}
              enabled={activeTab === "Gallery"}
            />
          )}
        </BottomSheetScrollView>

        {/* Invisible edge tap zones */}
        <View pointerEvents="box-none" style={styles.edgeOverlay}>
          <Pressable
            onPress={goPrev}
            disabled={activeIndex === 0}
            style={styles.edgeLeft}
            hitSlop={8}
          />
          <Pressable
            onPress={goNext}
            disabled={activeIndex === TABS.length - 1}
            style={styles.edgeRight}
            hitSlop={8}
          />
        </View>
      </View>
    </BottomSheet>
  );
}

const EDGE_WIDTH = 28;

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: colors.gray100,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  handleIndicator: {
    backgroundColor: "#bbb",
  },

  wrapper: {
    flex: 1,
  },

  sheetContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl + spacing.sm,
  },

  edgeOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  edgeLeft: {
    width: EDGE_WIDTH,
    height: "100%",
  },

  edgeRight: {
    width: EDGE_WIDTH,
    height: "100%",
  },
});
