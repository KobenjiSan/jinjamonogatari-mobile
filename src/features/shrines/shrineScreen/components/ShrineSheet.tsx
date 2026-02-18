import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import ShrineTabBar from "./ShrineTabBar";

import ShrineInfoTab from "../tabs/ShrineInfoTab";
import ShrineKamiTab from "../tabs/ShrineKamiTab";
import ShrineHistoryTab from "../tabs/ShrineHistoryTab";
import ShrineFolkloreTab from "../tabs/ShrineFolkloreTab";
import ShrineGalleryTab from "../tabs/ShrineGalleryTab";

import type { ShrineDetailModel } from "../../mappers";
import { colors, spacing, radius } from "../../../../shared/styles/tokens";

const TABS = ["Info", "Kami", "History", "Folklore", "Gallery"] as const;
export type Tab = (typeof TABS)[number];

type Props = {
  shrine: ShrineDetailModel;
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

          {activeTab === "Info" && <ShrineInfoTab shrine={shrine} />}
          {activeTab === "Kami" && <ShrineKamiTab shrine={shrine} />}
          {activeTab === "History" && <ShrineHistoryTab shrine={shrine} />}
          {activeTab === "Folklore" && <ShrineFolkloreTab shrine={shrine} />}
          {activeTab === "Gallery" && <ShrineGalleryTab shrine={shrine} />}
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
