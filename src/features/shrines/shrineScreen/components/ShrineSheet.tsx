import React from "react";
import { StyleSheet } from "react-native";
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

export default function ShrineSheet({
  shrine,
  sheetRef,
  snapPoints,
  activeTab,
  onChangeTab,
}: Props) {
  return (
    <BottomSheet
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
    >
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
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: colors.gray100,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  handleIndicator: {
    backgroundColor: "#bbb",
  },
  sheetContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl + spacing.sm,
  },
});
